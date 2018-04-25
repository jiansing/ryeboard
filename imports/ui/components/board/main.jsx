import React, {Component} from 'react';
import {connectAdvanced} from "react-redux";
import equals from 'fast-deep-equal';
import {bindActionCreators} from 'redux';
import * as Actions from "/imports/redux/actions/main";
import { DropTarget } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import snapToGrid from '/imports/helper/snapToGrid'
import update from 'updeep';

import Widget from '../widget/main';
import DragLayer from './dragLayer';

const widgetTarget = {
    drop(props, monitor, component) {

        const delta = monitor.getDifferenceFromInitialOffset();
        const item = monitor.getItem();

        let left = Math.round(item.left + delta.x);
        let top = Math.round(item.top + delta.y);

        [left, top] = snapToGrid(left, top);

        console.log(item, monitor, component, left ,top);

        if(item.newWidget) component.addWidget(update({left, top}, item));
        else component.moveWidget(item.id, left, top)
    },
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
    };
}

class PureBoard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: null,
            height: '',
            width: '',
            /*widgets: [
                {id: 'a', top: 150, left: 300, height: 150, width: 150, title: 'Drag me around'},
                {id: 'b', top: 150, left: 450, height: 150, width: 150, title: 'Drag me around'},
            ],*/
        };
    }

    selectWidget(id) {
        this.props.actions.selectWidgetFromBoard(id);
    }

    addWidget(data) {
        this.props.actions.addToBoard({...data});
    }

    moveWidget(id, left, top) {
        this.props.actions.modifyBoard({id, left, top});
    }

    resizeWidget(id, height, width) {
        this.props.actions.modifyBoard({id, height, width});
    }

    renderWidget(item) {
        return <Widget key={item.id} id={item.id} {...item}
                       handleSelect={(id)=>this.selectWidget(id)}
                       handleResize={(id, height, width)=>this.resizeWidget(id, height, width)}/>
    }

    render() {

        console.log(this.state.height, this.state.width);

        const style = {
            position: 'relative',
            height: '2000px',
            width: '2000px',
            backgroundColor: '#D9D3CD',
            backgroundImage: 'url("/grid.svg")',
            backgroundRepeat: 'repeat',
            backgroundSize: '15px 15px',
            overflow: 'hidden',
        };

        const { connectDropTarget } = this.props;

        const widgets = this.props.widgets;

        console.log(widgets);

        return connectDropTarget(
            <div id='board-container'
                 style={{marginTop: '50px', marginLeft: '75px', width: 'calc(100vw - 75px)', height: 'calc(100vh - 50px)', overflow: 'scroll'}}>
                <DragLayer />
                <div style={style} ref={(container) => this.container= container}>
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
            widgets: nextState.board
        };

        if(!equals(nextResult, result)){
            result = nextResult;
        }
        return result
    }
}

let dndBoard =  DropTarget(['widget', 'widgetPreview'], widgetTarget, collect)(PureBoard);
export default connectAdvanced(selector)(dndBoard)