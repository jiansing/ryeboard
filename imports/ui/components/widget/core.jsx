import React, {Component} from 'react';
import { DragSource } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { ResizableBox } from 'react-resizable';
import {connectAdvanced} from "react-redux";
import equals from 'react-fast-compare';
import {bindActionCreators} from 'redux';
import * as Actions from "/imports/redux/actions/main";
import store from '/imports/redux/store';

const widgetSource = {

    canDrag(props) {
        return !props.focused;
    },

    beginDrag(props) {

        let { id, type, left, top, width, height, selectedWidgets } = props;

        document.activeElement.blur();

        if(selectedWidgets === null) {
            props.handleSelect(props.id, {menu: props.dragging ? null : props.menu()});
            selectedWidgets = [{id, type, left, top, width, height}];
        }
        if(selectedWidgets.findIndex((elem)=>elem.id===id) === -1){
            props.actions.deselectAllWidgetFromBoard();
            selectedWidgets = [{id, type, left, top, width, height}];
        }

        props.actions.dragWidgetOnBoard(selectedWidgets);
        return {selectedWidgets, offsetTop: top, offsetLeft: left}
    },

    endDrag(props){
        props.actions.dragWidgetOnBoard(null);
    }
};


function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging(),
    };
}

function getStyles(props) {

    let {left, offsetLeft, top, offsetTop, isDragging, preview, selected, dragging} = props;

    if(offsetLeft && offsetTop) {
        left -= offsetLeft;
        top -= offsetTop;
    }

    const transform = `translate3d(${left}px, ${top}px, 0)`;

    return {
        position: 'absolute',
        transform,
        WebkitTransform: transform,
        opacity: isDragging || dragging ? 0 : 1,
        height: isDragging  || dragging ? 0 : '',
        zIndex: 1,
        outline: selected ? '2px dodgerBlue solid' : '2px transparent solid',
        boxShadow: preview ?
            '0 2px 2px 0 rgba(0, 0, 0, 0.25), 0 0px 2px 0 rgba(0, 0, 0, 0.25)' :
            '0 1px 1px 0 rgba(0, 0, 0, 0.15), 0 0px 1px 0 rgba(0, 0, 0, 0.15)',
        background: 'white',
    }
}


class PureWidget extends Component {

    constructor(props){
        super(props);
    }

    componentDidMount() {
        this.props.connectDragPreview(getEmptyImage(), {
            captureDraggingState: true,
        })
    }

    preventDndOnResize(event){
        document.activeElement.blur();
        event.stopPropagation();
        event.preventDefault();
        this.props.handleResize()
    }

    saveResize(event, data){
        let {width, height} = data.size;

        let widthOffset = width % 15,
            heightOffset = height % 15;

        if(widthOffset > 7)  width += 15 - widthOffset;
        else width -= widthOffset;

        if(heightOffset > 7)  height += 15 - heightOffset;
        else height -= heightOffset;

        this.props.handleResize(this.props.id, height, width);
    }

    select(event){
        if(event.shiftKey && !this.props.selected) {
            this.props.handleMultiSelect(this.props.id, {menu: this.props.dragging ? null : this.props.menu()});
        }
        else {
            this.props.handleSelect(this.props.id, {menu: this.props.dragging ? null : this.props.menu()});
        }
    }

    render() {

        const { id, connectDragSource, resizeOpts } = this.props;

        return connectDragSource(
            <div style={getStyles(this.props)}>
                <div>
                    <ResizableBox width={this.props.width || 300} height={this.props.height || 150}
                                  minConstraints={this.props.minSize || [90, 60]}
                                  onClickCapture={(event)=> this.select(event)}
                                  maxConstraints={this.props.maxSize || [Infinity, Infinity]}
                                  onResizeStart={(event)=>this.preventDndOnResize(event)}
                                  onResizeStop={(event, data)=>this.saveResize(event, data)}
                                  {...resizeOpts}>
                        {this.props.children}
                    </ResizableBox>
                </div>
            </div>
        );
    }
}

let dndWidget = DragSource('widget', widgetSource, collect)(PureWidget);

function selector(dispatch) {
    let result = {};
    const actions = bindActionCreators(Actions, dispatch);
    return (nextState, nextOwnProps) => {

        nextState = nextState.undoable.present;
        const nextResult = {
            dragging: function(){
                let dragging = nextState.boardLogic.dragging;
                if(!dragging) return null;
                if(Array.isArray(dragging)) {
                    let pos = dragging.findIndex((elem)=> elem.id === nextOwnProps.id);
                    return pos!==-1 && !nextOwnProps.preview;
                }
                else {
                    return dragging === nextOwnProps.id && !nextOwnProps.preview;
                }
            }(),
            selectedWidgets: function(){
                let selected = nextState.boardLogic.selected;
                if(!selected) return null;
                if(Array.isArray(selected)){
                    return selected.map(function(selected){
                        return nextState.boardLayout.find((elem) => elem.id === selected.id);
                    })
                }
                else{
                    return [nextState.boardLayout.find((elem) => elem.id === selected.id)];
                }
            }(),
            width: nextState.boardLayout.find((elem)=>elem.id === nextOwnProps.id).width,
            height: nextState.boardLayout.find((elem)=>elem.id === nextOwnProps.id).height,
            top: nextState.boardLayout.find((elem)=>elem.id === nextOwnProps.id).top,
            left: nextState.boardLayout.find((elem)=>elem.id === nextOwnProps.id).left,
            ...nextOwnProps
        };

        if(!equals(nextResult, result)){
            result = nextResult;
        }
        return result
    }
}

export default connectAdvanced(selector)(dndWidget)
