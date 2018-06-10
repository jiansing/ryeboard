import React, {Component} from 'react';
import {connectAdvanced} from "react-redux";
import equals from 'react-fast-compare';
import {bindActionCreators} from 'redux';
import * as Actions from "/imports/redux/actions/main";
import { ActionCreators } from 'redux-undo';
import { DropTarget } from 'react-dnd'
import snapToGrid from '/imports/helper/snapToGrid'
import update from 'updeep';
import Widget from '../widget/main';
import DragLayer from './dragLayer';
import { NativeTypes } from 'react-dnd-html5-backend';
import isUrlImage from '/imports/helper/isUrlImage';
import store from '/imports/redux/store';

const widgetTarget = {
    drop(props, monitor, component) {

        const hasDroppedOnChild = monitor.isOver(({ shallow: false }));
        if (!hasDroppedOnChild) {
            return
        }

        const item = monitor.getItem();

        if(Array.isArray(item.selectedWidgets)){
            const delta = monitor.getDifferenceFromInitialOffset();

            let widgetArray = []

            item.selectedWidgets.forEach(function(selection){
                let left = selection.left + delta.x;
                let top = selection.top + delta.y;

                [left, top] = snapToGrid(left, top);

                widgetArray.push({id: selection.id, left, top});
            });

            component.multiMoveWidget(widgetArray);

        }
        else{
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

                [left, top] = snapToGrid(left, top);

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


                            console.log('delete:', selected);

                            if(selected != null){
                                console.log('removing');
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

    multiSelectWidget(id, data) {
        let selection = this.props.selectedWidgets;
        console.log('multi select test:', selection);
        if(Array.isArray(selection) && selection.findIndex((elem)=>elem.id === id)!==-1){
            this.props.actions.deselectWidgetFromBoard(id, data);
        }
        else this.props.actions.multiSelectWidgetFromBoard(id, data);
        if(Meteor.user()) Meteor.call('boards.update', store.getState());
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
        console.log('deselect widget');
        if(!event.shiftKey){
            this.props.actions.deselectAllWidgetFromBoard();
        }
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
            zoomOrigin = this.props.zoom ? this.props.zoom.origin : '';

        return connectDropTarget(
            <div id='board-container'
                 onClick={(event)=> this.deselectAllWidgets(event)}
                 style={{marginTop: '50px', marginLeft: '75px', width: 'calc(100vw - 75px)',
                     height: 'calc(100vh - 50px)', overflow: 'scroll'}}>
                <DragLayer zoomScale={zoomScale} zoomOrigin={zoomOrigin}/>
                <div  id='board' ref={(container) => this.container= container}
                      style={{transform: zoomScale, transformOrigin: '0 0'}}>
                    <div className={this.props.isDragging || this.state.resizing ? 'grid show' : 'grid hide'}
                         style={{width: '100%', height: '100%', position: 'absolute'}} />
                    {widgets.map(widget => this.renderWidget(widget))}
                </div>
                <FloatingMenu {...this.props}/>
            </div>

        );
    }
}

class FloatingMenu extends React.Component{
    constructor(props){
        super(props);
    }

    zoomOut(){
        let zoom = this.props.zoom ? this.props.zoom.value : 1;
        if(zoom > .25) zoom -= .25;

        let scale = 'scale(' + zoom + ', ' + zoom + ')';

        let top = document.getElementById('board-container').pageYOffset ||
            document.getElementById('board-container').scrollTop ||
            document.getElementById('board-container').scrollTop || 0,
            left = document.getElementById('board-container').pageXOffset ||
                document.getElementById('board-container').scrollLeft ||
                document.getElementById('board-container').scrollLeft || 0,
            width = document.getElementById('board-container').scrollWidth,
            height = document.getElementById('board-container').scrollHeight;

        let origin = left / 30 + '% ' + top / 30 + '%';

        this.props.actions.modifySettingsParam({zoom: {value: zoom, scale, origin}});
        console.log('zooming:', zoom);
    }

    zoomIn(){
        let zoom = this.props.zoom ? this.props.zoom.value : 1;
        if(zoom < 1.75) zoom += .25;

        let scale = 'scale(' + zoom + ', ' + zoom + ')';

        let top = document.getElementById('board-container').pageYOffset ||
            document.getElementById('board-container').scrollTop ||
            document.getElementById('board-container').scrollTop || 0,
            left = document.getElementById('board-container').pageXOffset ||
                document.getElementById('board-container').scrollLeft ||
                document.getElementById('board-container').scrollLeft || 0,
            width = document.getElementById('board-container').scrollWidth,
            height = document.getElementById('board-container').scrollHeight;

        let origin = left / 30 + '% ' + top / 30 + '%';

        this.props.actions.modifySettingsParam({zoom: {value: zoom, scale, origin}});
        console.log('zooming:', zoom);

    }

    render(){
        return (
            <div style={{position: 'fixed', right: '10px', bottom: '10px', display: 'flex', flexDirection: 'column', zIndex: '15'}}>
                <button onClick={() => this.zoomIn()}>
                    Zoom In
                </button>

                <button onClick={() => this.zoomOut()}>
                    Zoom Out
                </button>

                <button>
                    Trash
                </button>
            </div>
        )
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