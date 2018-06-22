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
import store from '/imports/redux/store';
import DragSelect from '/imports/helper/dragSelect'
import FloatingMenu from '../floating-menu/main'

const widgetTarget = {
    drop(props, monitor, component) {

        //End if something was dropped on a widget and not the board!
        const hasDroppedOnChild = monitor.isOver(({ shallow: false }));
        if (!hasDroppedOnChild) {
            return
        }

        const item = monitor.getItem(), zoomValue = props.zoom ? props.zoom.value : 1;

        if(Array.isArray(item.selectedWidgets)){

            const delta = monitor.getDifferenceFromInitialOffset();

            let widgetArray = [];

            item.selectedWidgets.forEach(function(selection){
                let left = selection.left + delta.x /zoomValue;
                let top = selection.top + delta.y / zoomValue;

                [left, top] = snapToGrid(left, top);

                widgetArray.push({id: selection.id, left, top});
            });

            component.multiMoveWidget(widgetArray);

        }
        else {
            if(item.files){

                let {x, y} = monitor.getClientOffset(),
                    top = document.getElementById('board-container').pageYOffset ||
                        document.getElementById('board-container').scrollTop ||
                        document.getElementById('board-container').scrollTop || 0,
                    left = document.getElementById('board-container').pageXOffset ||
                        document.getElementById('board-container').scrollLeft ||
                        document.getElementById('board-container').scrollLeft || 0;

                if(Meteor.user()){
                    let uploader = new Slingshot.Upload("userImageUploads");
                    uploader.send(monitor.getItem().files[0], function (error, downloadUrl) {
                        if (error) {
                            alert (error);
                        }
                        else {
                            component.addWidget({data: {image: downloadUrl}, left: x + left - 75, top: y + top - 50, height: 150, width: 150, type: 'image'});
                        }
                    });
                }
                else{
                    let data  = URL.createObjectURL(monitor.getItem().files[0]);
                    component.addWidget({data: {image: data}, left: x + left - 75, top: y + top - 50, height: 150, width: 150, type: 'image'});
                }
            }
            else if(item.urls){
                let {x, y} = monitor.getClientOffset(),
                    top = document.getElementById('board-container').pageYOffset ||
                        document.getElementById('board-container').scrollTop ||
                        document.getElementById('board-container').scrollTop || 0,
                    left = document.getElementById('board-container').pageXOffset ||
                        document.getElementById('board-container').scrollLeft ||
                        document.getElementById('board-container').scrollLeft || 0;

                let data  = item.urls[0];

                isUrlImage(data, ()=> component.addWidget({data: {image: data}, left: x + left - 75, top: y + top - 50, height: 150, width: 150, type: 'image'}), 10000);
            }
            else {
                const delta = monitor.getDifferenceFromInitialOffset();

                let left = item.left + delta.x;
                let top = item.top + delta.y;

                [left, top] = snapToGrid(left / zoomValue, top / zoomValue);

                if(item.newWidget) {
                    delete item.newWidget;
                    component.addWidget(update({left, top}, item));
                }
                else component.moveWidget(item.id, left, top)

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
        let self = this;

        window.addEventListener('keydown', function(event){
            if(document.activeElement === document.body){

                let key = event.keyCode;
                switch(key){
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
            if(self.props.selectedWidgets){
                let key = event.keyCode;

                if(document.activeElement === document.body){
                    switch(key){
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
        if(Array.isArray(selection) && selection.findIndex((elem)=>elem.id === id)!==-1){
            this.props.actions.deselectWidgetFromBoard(id);
        }
        else {
            this.props.actions.multiSelectWidgetFromBoard(id);
        }
    }

    addWidget(data) {
        this.props.actions.addToBoard({...data});
        this.props.actions.setMutable();
        if(Meteor.user()) Meteor.call('boards.update', store.getState());
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

        if(!id && !height && !width) this.setState({resizing: true});
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

    componentDidUpdate(){

        if(this.props.zoom.scroll){
            let self = this;
            setTimeout(function(){
                document.getElementById('board-container').scrollTop = self.props.zoom.scroll.scrollTop;
                document.getElementById('board-container').scrollLeft = self.props.zoom.scroll.scrollLeft;

                //scrollToTop(document.getElementById('board-container'), self.props.zoom.scroll.scrollTop, 250);
                //scrollToLeft(document.getElementById('board-container'), self.props.zoom.scroll.scrollLeft, 250);

                self.props.actions.modifySettingsParam({zoom: {scroll: null}});
            }, 0);

            function scrollToTop(element, to, duration) {
                let start = element.scrollTop,
                    change = to - start,
                    currentTime = 0,
                    increment = 25;

                let animateScroll = function(){
                    currentTime += increment;
                    let val = Math.easeInOutQuad(currentTime, start, change, duration);
                    element.scrollTop = val;
                    if(currentTime < duration) {
                        setTimeout(animateScroll, increment);
                    }
                };
                animateScroll();
            }

            function scrollToLeft(element, to, duration) {
                let start = element.scrollLeft,
                    change = to - start,
                    currentTime = 0,
                    increment = 25;

                let animateScroll = function(){
                    currentTime += increment;
                    let val = Math.easeInOutQuad(currentTime, start, change, duration);
                    element.scrollLeft = val;
                    if(currentTime < duration) {
                        setTimeout(animateScroll, increment);
                    }
                };
                animateScroll();
            }

            //t = current time
            //b = start value
            //c = change in value
            //d = duration
            Math.easeInOutQuad = function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t + b;
                t--;
                return -c/2 * (t*(t-2) - 1) + b;
            };
        }
    }

    componentDidMount(){
        
        let self = this,
            selectDisabled = true,
            mouseDown = [0,0],
            dragValue = [0,0];
        
        let ds = new DragSelect({
            selectables: document.getElementsByClassName('selectable'),
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
            multiSelectKeys: []
        });

        ds.area.addEventListener('mousedown', function (event) {
            ds.clearSelection();

            selectDisabled = event.srcElement.className.indexOf('grid') === -1;
            if(selectDisabled){
                ds.stop();
            }
            else {
                ds.addSelectables(document.getElementsByClassName('selectable'));

                ds.setScale(self.props.zoom.value);
                ds.start();
            }
            mouseDown = [event.pageX, event.pageY];
        }, true);

        ds.area.addEventListener('mousedown', function (event) {

            if(!selectDisabled && !event.shiftKey) {
                self.deselectAllWidgets(event);
            }

        }, false);

        ds.area.addEventListener('mousemove', function (event) {
            if(mouseDown) {
                dragValue = [event.pageX, event.pageY]
            }
        }, true);


        ds.area.addEventListener('mouseup', function (event) {
            if(!selectDisabled && Math.abs(mouseDown[0] - dragValue[0]) <= 5 && Math.abs(mouseDown[1] - dragValue[1]) <= 5){
                //self.deselectAllWidgets(event)
            }
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
                 style={{marginTop: '50px', marginLeft: '75px', width: 'calc(100vw - 75px)',
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