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

        component.moveWidget(item.id, left, top)
    },
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
    };
}

class PureBoard extends Component {

    constructor(props){
        super(props);
        this.state = {
            selected: null,
            height: '',
            width: '',
            widgets: {
                a: { top: 150, left: 300, height: 150, width: 150, title: 'Drag me around' },
                b: { top: 150, left: 450, height: 150, width: 150, title: 'Drag me around' },
            },
        };
    }

    componentDidMount(){
        this.updateSize();
    }

    selectWidget(id) {
        this.setState({selected: id});
    }

    moveWidget(id, left, top) {
        let newState = update({ widgets: {[id]:  { left: left, top: top } } }, this.state);
        this.setState(newState);
        this.updateSize();
    }

    resizeWidget(id, height, width) {
        let newState = update({ widgets: {[id]:  { height: height, width: width } } }, this.state);
        this.setState(newState);
        this.updateSize();
    }

    renderWidget(item, key) {
        return <Widget isSelected={this.state.selected === key} key={key} id={key} {...item}
                       handleSelect={(id)=>this.selectWidget(id)}
                       handleResize={(id, height, width)=>this.resizeWidget(id, height, width)}/>
    }

    updateSize(){
        if(this.state.height !== document.getElementById('board-container').scrollHeight + 'px' ||
            this.state.width !== document.getElementById('board-container').scrollWidth + 'px')

        this.setState({
            height: document.getElementById('board-container').scrollHeight + 'px',
            width: document.getElementById('board-container').scrollWidth + 'px',
        });
    }

    render() {

        console.log(this.state.height, this.state.width);

        const style = {
            position: 'relative',
            height: '2500px',
            width: '2500px',
            backgroundColor: '#D9D3CD',
            backgroundImage: 'url("/grid.svg")',
            backgroundRepeat: 'repeat',
            backgroundSize: '15px 15px',
            overflow: 'hidden',
        }

        const { connectDropTarget } = this.props;

        const { widgets } = this.state;

        return connectDropTarget(
            <div id='board-container'
                 style={{marginTop: '50px', marginLeft: '75px', width: 'calc(100vw - 75px)', height: 'calc(100vh - 50px)', overflow: 'scroll'}}>
                <DragLayer />
                <div style={style} ref={(container) => this.container= container}>
                    {Object.keys(widgets).map(key => this.renderWidget(widgets[key], key))}
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

        };

        if(!equals(nextResult, result)){
            result = nextResult;
        }
        return result
    }
}

let dndBoard =  DropTarget(['widget', 'widgetPreview'], widgetTarget, collect)(PureBoard);
export default connectAdvanced(selector)(dndBoard)