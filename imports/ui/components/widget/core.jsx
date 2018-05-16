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
        if(event.shiftKey) {
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
                                  minConstraints={this.props.minSize || [90, 90]}
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
            dragging: nextState.boardLogic.dragging,
            selectedWidgets: nextState.boardLogic.selected,
            ...nextOwnProps
        };

        if(!equals(nextResult, result)){

            if(nextResult.dragging) {
                if(Array.isArray(nextResult.dragging)) {
                    let pos = nextResult.dragging.findIndex((elem)=> elem.id === nextOwnProps.id);
                    nextResult.dragging = pos!==-1 && !nextOwnProps.preview;
                }
                else {
                    nextResult.dragging = nextResult.dragging === nextOwnProps.id && !nextOwnProps.preview;
                }
            }
            if(nextResult.selectedWidgets){
                if(Array.isArray(nextResult.selectedWidgets)){
                    nextResult.selectedWidgets = nextResult.selectedWidgets.map(function(selected){
                        return nextState.boardLayout.find((elem) => elem.id === selected.id);
                    })
                }
                else{
                    nextResult.selectedWidgets = [nextState.boardLayout.find((elem) => elem.id === nextResult.selectedWidgets.id)];
                }
            }

            result = nextResult;
        }
        return result
    }
}

export default connectAdvanced(selector)(dndWidget)
