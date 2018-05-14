import React, {Component} from 'react';
import {connectAdvanced} from "react-redux";
import equals from 'fast-deep-equal';
import {bindActionCreators} from 'redux';
import * as Actions from "/imports/redux/actions/main";
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

        if(item.files){

            let {x, y} = monitor.getClientOffset(),
                top = document.getElementById('board-container').pageYOffset ||
                    document.getElementById('board-container').scrollTop ||
                    document.getElementById('board-container').scrollTop || 0,
                left = document.getElementById('board-container').pageXOffset ||
                    document.getElementById('board-container').scrollLeft ||
                    document.getElementById('board-container').scrollLeft || 0;

            let uploader = new Slingshot.Upload("userImageUploads");
            uploader.send(monitor.getItem().files[0], function (error, downloadUrl) {
                if (error) {
                    alert (error);
                }
                else {
                    component.addWidget({data: {image: downloadUrl}, left: x + left - 75, top: y + top - 50, height: 150, width: 150, type: 'image'});
                }
            });
            return;
        }
        if(item.urls){
            let {x, y} = monitor.getClientOffset(),
                top = document.getElementById('board-container').pageYOffset ||
                    document.getElementById('board-container').scrollTop ||
                    document.getElementById('board-container').scrollTop || 0,
                left = document.getElementById('board-container').pageXOffset ||
                    document.getElementById('board-container').scrollLeft ||
                    document.getElementById('board-container').scrollLeft || 0;

            let data  = item.urls[0];

            isUrlImage(data, ()=> component.addWidget({data: {image: data}, left: x + left - 75, top: y + top - 50, height: 150, width: 150, type: 'image'}), 10000);

            return;
        }

        const delta = monitor.getDifferenceFromInitialOffset();

        let left = item.left + delta.x;
        let top = item.top + delta.y;

        [left, top] = snapToGrid(left, top);

        if(item.newWidget) {
            delete item.newWidget;
            component.addWidget(update({left, top}, item));
        }
        else component.moveWidget(item.id, left, top)
    },
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isDragging: monitor.isOver(),
    };
}

const style = {
    position: 'relative',
    height: '2000px',
    width: '2000px',
    backgroundColor: '#D9D3CD',
    backgroundImage: 'url("/grid.svg")',
    backgroundRepeat: 'repeat',
    backgroundSize: '15px 15px',
    overflow: 'hidden',
    cursor: 'default'
};

function getStyle(props){
    return{
        position: 'relative',
        height: '2000px',
        width: '2000px',
        backgroundColor: '#D9D3CD',
        backgroundImage: props.isDragging ? 'url("/grid.svg")' : '',
        backgroundRepeat: 'repeat',
        backgroundSize: '15px 15px',
        overflow: 'hidden',
        cursor: 'default'
    }
}

class PureBoard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: null,
            resizing: false,
        };
    }

    selectWidget(id, data) {
        console.log('selecting widget:', id, data);
        this.props.actions.selectWidgetFromBoard(id, data);
    }

    multiSelectWidget(id, data) {
        let selection = this.props.selectedWidgets;
        if(Array.isArray(selection) && selection.findIndex((elem)=>elem.id === id)!==-1){
            this.props.actions.deselectWidgetFromBoard(id, data);
        }
        else this.props.actions.multiSelectWidgetFromBoard(id, data);
        Meteor.call('boards.update', store.getState());
    }

    addWidget(data) {
        this.props.actions.addToBoard({...data});
        this.props.actions.setMutable();
        Meteor.call('boards.update', store.getState());
    }

    moveWidget(id, left, top) {
        this.props.actions.modifyBoard({id, left, top});
        this.props.actions.setMutable();
        Meteor.call('boards.update', store.getState());
    }

    resizeWidget(id, height, width) {
        if(!id && !height && !width) this.setState({resizing: true});
        else{
            this.props.actions.modifyBoard({id, height, width});
            Meteor.call('boards.update', store.getState());
            this.setState({resizing: false});
        }
    }

    deselectAllWidgets(event){
        if(!event.shiftKey){
            this.props.actions.deselectAllWidgetFromBoard();
        }
    }


    renderWidget(item) {
        return <Widget key={item.id} id={item.id} {...item}
                       handleMultiSelect={(id, data)=>this.multiSelectWidget(id, data)}
                       handleSelect={(id, data)=>this.selectWidget(id, data)}
                       handleResize={(id, height, width)=>this.resizeWidget(id, height, width)}/>
    }

    render() {
        const { connectDropTarget } = this.props;

        const widgets = this.props.widgets;

        return connectDropTarget(
            <div id='board-container'
                 onClickCapture={(event)=> this.deselectAllWidgets(event)}
                 style={{marginTop: '50px', marginLeft: '75px', width: 'calc(100vw - 75px)', height: 'calc(100vh - 50px)', overflow: 'scroll'}}>
                <DragLayer />
                <div  id='board' ref={(container) => this.container= container}>
                    <div className={this.props.isDragging || this.state.resizing ? 'grid show' : 'grid hide'}
                         style={{width: '100%', height: '100%', position: 'absolute'}} />
                    {widgets.map(widget => this.renderWidget(widget))}
                </div>
            </div>

        );
    }
}

function selector(dispatch) {
    let result = {};
    const actions = bindActionCreators(Actions, dispatch);
    return (nextState, nextOwnProps) => {

        nextState = nextState.undoable.present;

        const nextResult = {
            actions: actions,
            selectedWidgets: nextState.boardLogic.selected,
            widgets: nextState.boardLayout
        };

        if(!equals(nextResult, result)){
            result = nextResult;
        }
        return result
    }
}

let dndBoard =  DropTarget(['widget', 'widgetPreview', NativeTypes.FILE, NativeTypes.URL], widgetTarget, collect)(PureBoard);
export default connectAdvanced(selector)(dndBoard)