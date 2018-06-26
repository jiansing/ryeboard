import React, {Component} from 'react';
import {connectAdvanced} from "react-redux";
import equals from 'react-fast-compare';
import {bindActionCreators} from 'redux';
import { ActionCreators } from 'redux-undo';
import { DropTarget } from 'react-dnd'
import update from 'updeep';
import { NativeTypes } from 'react-dnd-html5-backend';

import * as Actions from "/imports/redux/actions/main";
import snapToGrid from '/imports/helper/snapToGrid'
import Widget from '../widget/main';
import DragLayer from './dragLayer';
import isUrlImage from '/imports/helper/isUrlImage';
import generateUID from '/imports/helper/uIDGenerator';
import store from '/imports/redux/store';
import DragSelect from '/imports/helper/dragSelect'
import FloatingMenu from '../floating-menu/main'

/**
 * The board is the main component that users will mostly be working with
 *
 * It houses widgets as well as the floating menu. This portion is the main functionality of the board.
 *
 */

const widgetTarget = {
    drop(props, monitor, component) {

        //End if something was dropped on a widget and not the board!
        const hasDroppedOnChild = monitor.isOver(({ shallow: false }));
        if (!hasDroppedOnChild) {
            return
        }

        const item = monitor.getItem(), zoomValue = props.zoom ? props.zoom.value : 1;

        //adding files
        if(item.files){

            let {x, y} = monitor.getClientOffset(),
                top = document.getElementById('board-container').pageYOffset ||
                    document.getElementById('board-container').scrollTop ||
                    document.getElementById('board-container').scrollTop || 0,
                left = document.getElementById('board-container').pageXOffset ||
                    document.getElementById('board-container').scrollLeft ||
                    document.getElementById('board-container').scrollLeft || 0;

            item.files.forEach(function(file, index){

                //Need to adjust left and top position depending on zoom value
                let [adjustedLeft, adjustedTop] = snapToGrid((left + x)/ zoomValue, (top + y - 50) / zoomValue);

                //Add widget first, before image is loaded/uploaded on S3
                let id = component.addWidget({
                    left: adjustedLeft + index * 15, top: adjustedTop + index * 15,
                    data: {loading: true},
                    height: 150, width: 150, type: 'image'});

                //Only upload to S3 if user is logged in
                if(Meteor.user()){
                    let uploader = new Slingshot.Upload("userImageUploads");
                    uploader.send(file, function (error, downloadUrl) {
                        if (error) {
                            alert (error);
                        }
                        else {
                            //Set iamge
                            component.props.actions.modifyBoard({id, data: {image: downloadUrl, loading: false}});
                        }
                    });
                }
                //Else just use as local URL Object
                else{
                    let data  = URL.createObjectURL(file);

                    //Set image
                    component.props.actions.modifyBoard({id, data: {image: data, loading: false}});
                }
            });
        }
        //adding URLS
        else if(item.urls){

            let {x, y} = monitor.getClientOffset(),
                top = document.getElementById('board-container').pageYOffset ||
                    document.getElementById('board-container').scrollTop ||
                    document.getElementById('board-container').scrollTop || 0,
                left = document.getElementById('board-container').pageXOffset ||
                    document.getElementById('board-container').scrollLeft ||
                    document.getElementById('board-container').scrollLeft || 0;

            let data  = item.urls[0];

            let [adjustedLeft, adjustedTop] = snapToGrid((left + x)/ zoomValue, (top + y - 50) / zoomValue);

            // Check if URL is image
            //TODO: add loading and error screen if url is not image
            isUrlImage(data, ()=> component.addWidget({
                data: {image: data}, left: adjustedLeft,
                top: adjustedTop, height: 150, width: 150, type: 'image'}), 10000);
        }
        //adding / moving widgets
        else {

            const delta = monitor.getDifferenceFromInitialOffset();

            //When multi moving widgets
            if(item.selectedWidgets){
                let widgetArray = [];

                item.selectedWidgets.forEach(function(selection){
                    let left = selection.left + delta.x /zoomValue;
                    let top = selection.top + delta.y / zoomValue;

                    let [adjustedLeft, adjustedTop] = snapToGrid(left, top);

                    widgetArray.push({id: selection.id, left: adjustedLeft, top: adjustedTop});
                });

                component.multiMoveWidget(widgetArray);
            }
            //When single moving/adding widgets
            else{
                let left = item.left + delta.x;
                let top = item.top + delta.y;

                let [adjustedLeft, adjustedTop] = snapToGrid(left / zoomValue, top / zoomValue);

                //Check if adding new widget or moving existing widgets
                if(item.newWidget) {
                    delete item.newWidget;
                    component.addWidget(update({left: adjustedLeft, top: adjustedTop}, item));
                }
                else component.moveWidget(item.id, adjustedLeft, adjustedTop)
            }
        }
    }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isDragging: monitor.isOver(),
    };
}

class PureBoard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: null,
            resizing: false,
            dragging: false,
        };

        this.setupKeyInputs();
    }

    componentDidUpdate(){

        if(this.props.zoom.scroll){
            let self = this;

            // Scroll to offset zoom
            //TODO: Animate scroll and zoom
            setTimeout(function(){
                document.getElementById('board-container').scrollTop = self.props.zoom.scroll.scrollTop;
                document.getElementById('board-container').scrollLeft = self.props.zoom.scroll.scrollLeft;

                self.props.actions.modifySettingsParam({zoom: {scroll: null}});
            }, 0);
        }
    }

    componentDidMount(){
        this.setupSelectBox()
    }

    //Setting up key bindings
    setupKeyInputs(){
        let self = this;

        window.addEventListener('keydown', function(event){

            //Check if a widget has focus. This poriton only runs when no-one has focus
            if(document.activeElement === document.body){

                let key = event.keyCode;
                switch(key){
                    //for undo and redo
                    case 90 : {
                        if(event.metaKey){
                            if(event.shiftKey){
                                self.props.actions.redo();
                                if(Meteor.user()) Meteor.call('boards.update', store.getState());
                                event.stopPropagation();
                            }
                            else{
                                self.props.actions.undo();
                                if(Meteor.user()) Meteor.call('boards.update', store.getState());
                                event.stopPropagation();
                            }
                        }
                    }
                }
            }
            //Only runs when a widget is selected but no HTML focus is given.
            if(self.props.selectedWidgets){
                let key = event.keyCode;

                if(document.activeElement === document.body){
                    switch(key){
                        //Deleting Widget
                        case 8 : {
                            let selected = self.props.selectedWidgets;
                            if(Array.isArray(selected)){
                                selected = selected.map((elem)=> elem.id)
                            }
                            else selected = selected.id;

                            if(selected != null){
                                self.props.actions.removeFromBoard(selected);
                                self.props.actions.setMutable();
                                if(Meteor.user()) Meteor.call('boards.update', store.getState());
                            }

                            break;
                        }
                    }

                }
            }
        }, true);
    }

    selectWidget(id, data) {
        this.props.actions.selectWidgetFromBoard(id, data);
    }

    multiSelectWidget(id) {
        let selection = this.props.selectedWidgets;

        //Deselect if it is already selected
        if(Array.isArray(selection) && selection.findIndex((elem)=>elem.id === id)!==-1){
            this.props.actions.deselectWidgetFromBoard(id);
        }
        else {
            this.props.actions.multiSelectWidgetFromBoard(id);
        }
    }

    addWidget(data) {
        let id = generateUID(this.props.widgets.map((elem)=> elem.id));
        this.props.actions.addToBoard({id, ...data});
        this.props.actions.setMutable();
        if(Meteor.user()) Meteor.call('boards.update', store.getState());
        return id;
    }

    multiMoveWidget(widgets){
        let self = this;
        this.props.actions.dragWidgetOnBoard(null);
        widgets.forEach(function(widget){
            self.props.actions.modifyBoard({id: widget.id, left: widget.left, top: widget.top});
        });
        this.props.actions.setMutable();
        if(Meteor.user()) Meteor.call('boards.update', store.getState());
    }

    moveWidget(id, left, top) {
        this.props.actions.dragWidgetOnBoard(null);
        this.props.actions.modifyBoard({id, left, top});
        this.props.actions.setMutable();
        if(Meteor.user()) Meteor.call('boards.update', store.getState());
    }

    resizeWidget(id, height, width) {

        if(!id && !height && !width) {
            //Show grid
            this.setState({resizing: true});
        }
        else{
            this.props.actions.modifyBoard({id, height, width});
            this.props.actions.setMutable();
            if(Meteor.user()) Meteor.call('boards.update', store.getState());
            this.setState({resizing: false});
        }
    }

    deselectAllWidgets(event){
        if(!event.shiftKey){
            document.activeElement.blur();
            this.props.actions.deselectAllWidgetFromBoard();
        }
    }

    //Sets up a draggable select box
    setupSelectBox(){

        let self = this,
            selectDisabled = true,
            mouseDown = [0,0],
            dragValue = [0,0];

        let ds = new DragSelect({
            //Only allow these elements to be selected
            selectables: document.getElementsByClassName('selectable'),
            //Restrict selection area to board-container
            area: document.getElementById('board-container'),
            onElementSelect: function(element) {
                if(!selectDisabled){
                    let id = element.id;
                    self.multiSelectWidget(parseInt(id));
                }
            },
            onElementUnselect: function(element) {
                if(!selectDisabled){
                    let id = element.id;
                    self.multiSelectWidget(parseInt(id));
                }
            },
            onDragStart: function(event) {
                event.preventDefault();
                event.stopPropagation();
            },
            onDragMove: function(event) {
                event.preventDefault();
                event.stopPropagation();
            },
            //Prevent default dragSelect behaviour
            multiSelectKeys: []
        });

        ds.area.addEventListener('mousedown', function (event) {
            //clear selection to start new one
            ds.clearSelection();

            //Check if drag started from widget or board. If widget, disable.
            selectDisabled = event.srcElement.className.indexOf('grid') === -1;

            //We're dragging a widget! Stop DS!
            if(selectDisabled){
                ds.stop();
            }
            //We're dragging the selectbox, start it up!
            else {

                //add any new selectable widgets. Need to do this manually cause it doesn't update automatically
                ds.addSelectables(document.getElementsByClassName('selectable'));

                //Custom code to DS library to allow zoom-in-out functionality
                ds.setScale(self.props.zoom.value);
                ds.start();
            }
            //Record beginning coordinate
            mouseDown = [event.pageX, event.pageY];
        }, true);

        ds.area.addEventListener('mousedown', function (event) {

            //Deselect all widgets only if board is source of the click and shift key is not pressed
            if(!selectDisabled && !event.shiftKey) {
                self.deselectAllWidgets(event);
            }

        }, false);

        ds.area.addEventListener('mousemove', function (event) {
            if(mouseDown) {
                //Record how much is dragged
                dragValue = [event.pageX, event.pageY]
            }
        }, true);


        ds.area.addEventListener('mouseup', function () {

            //Reset DS
            dragValue = [0,0];
            mouseDown = [0,0];
            selectDisabled = true;
            ds.clearSelection();
        }, true);
    }

    renderWidget(item) {
        return <Widget key={item.id} id={item.id} type={item.type}
                       handleMultiSelect={(id, data)=>this.multiSelectWidget(id, data)}
                       handleSelect={(id, data)=>this.selectWidget(id, data)}
                       handleResize={(id, height, width)=>this.resizeWidget(id, height, width)}/>
    }

    render() {
        const { connectDropTarget } = this.props;

        const widgets = this.props.widgets;

        let zoomScale = this.props.zoom ? this.props.zoom.scale : '',
            zoomValue = this.props.zoom ? this.props.zoom.value : 1;

        return connectDropTarget(
            <div id='board-container'
                 style={{marginTop: '50px', width: '100vw',
                     height: 'calc(100vh - 50px)', overflow: 'scroll'}}>

                <DragLayer zoomValue={zoomValue} zoomScale={zoomScale}/>
                <div  id='board' ref={(container) => this.container= container}
                      style={{transform: zoomScale + ' translate3d(0px,0px,0px)', transformOrigin: '0 0'}}>
                    <div className={this.props.isDragging || this.state.resizing ? 'grid show' : 'grid hide'}
                         style={{width: '100%', height: '100%', position: 'absolute'}} />
                    {widgets.map(widget => this.renderWidget(widget))}
                </div>

                <FloatingMenu {...this.props}/>
            </div>

        );
    }
}

function selector(dispatch) {
    let result = {};
    const actions = bindActionCreators(Object.assign({}, Actions, ActionCreators), dispatch);
    return (nextState, nextOwnProps) => {

        let zoom = nextState.settings.zoom;
        nextState = nextState.undoable.present;

        const nextResult = {
            actions: actions,
            selectedWidgets: nextState.boardLogic.selected,
            widgets: nextState.boardLayout,
            zoom
        };

        if(!equals(nextResult, result)){
            result = nextResult;
        }
        return result
    }
}

let dndBoard =  DropTarget(['widget', 'widgetPreview', NativeTypes.FILE, NativeTypes.URL], widgetTarget, collect)(PureBoard);
export default connectAdvanced(selector)(dndBoard)