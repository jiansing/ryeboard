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

const widgetTarget = {
    drop(props, monitor, component) {

        const delta = monitor.getDifferenceFromInitialOffset();
        const item = monitor.getItem();

        let left = Math.round(item.left + delta.x);
        let top = Math.round(item.top + delta.y);

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
        this.props.actions.selectWidgetFromBoard(id, data);
    }

    addWidget(data) {
        this.props.actions.addToBoard({...data});
    }

    moveWidget(id, left, top) {
        this.props.actions.modifyBoard({id, left, top});
    }

    resizeWidget(id, height, width) {
        if(!id && !height && !width) this.setState({resizing: true});
        else{
            this.props.actions.modifyBoard({id, height, width});
            this.setState({resizing: false});
        }
    }

    renderWidget(item) {
        return <Widget key={item.id} id={item.id} {...item}
                       handleSelect={(id, data)=>this.selectWidget(id, data)}
                       handleResize={(id, height, width)=>this.resizeWidget(id, height, width)}/>
    }

    render() {
        const { connectDropTarget } = this.props;

        const widgets = this.props.widgets;

        return connectDropTarget(
            <div id='board-container'
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

        const nextResult = {
            actions: actions,
            widgets: nextState.boardLayout
        };

        if(!equals(nextResult, result)){
            result = nextResult;
        }
        return result
    }
}

let dndBoard =  DropTarget(['widget', 'widgetPreview', NativeTypes.FILE], widgetTarget, collect)(PureBoard);
export default connectAdvanced(selector)(dndBoard)