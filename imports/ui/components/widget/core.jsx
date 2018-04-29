import React, {Component} from 'react';
import { DragSource } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { ResizableBox } from 'react-resizable';

const widgetSource = {

    beginDrag(props) {
        const { id, type, left, top, width, height } = props;
        props.handleSelect(id);
        document.activeElement.blur();
        return { id, type, left, top, width, height }
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

    const {left, top, isDragging, preview, selected} = props;
    const transform = `translate3d(${left}px, ${top}px, 0)`;

    return {
        position: 'absolute',
        transform,
        WebkitTransform: transform,
        opacity: isDragging ? 0 : 1,
        height: isDragging ? 0 : '',
        zIndex: 1,
        outline: selected ? '2px dodgerBlue solid' : '2px transparent solid',
        boxShadow: preview ?
            '0 2px 2px 0 rgba(0, 0, 0, 0.25), 0 0px 2px 0 rgba(0, 0, 0, 0.25)' :
            '0 1px 1px 0 rgba(0, 0, 0, 0.15), 0 0px 1px 0 rgba(0, 0, 0, 0.15)',
        background: 'white',
    }
}


class Widget extends Component {

    constructor(props){
        super(props);
        this.state = {focused: false}
    }

    componentDidMount() {
        this.props.connectDragPreview(getEmptyImage(), {
            captureDraggingState: true,
        })
    }

    preventDndOnResize(event){
        this.props.handleSelect(this.props.id);
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

        console.log("SAVING AS:", width, height);

        this.props.handleResize(this.props.id, height, width);
    }

    render() {

        const { id, connectDragSource, resizeOpts } = this.props;

        return connectDragSource(
            <div style={getStyles(this.props)}>
                <div>
                    <ResizableBox width={this.props.width || 300} height={this.props.height || 150}
                                  minConstraints={this.props.minSize || [90, 90]}
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

export default DragSource('widget', widgetSource, collect)(Widget);
