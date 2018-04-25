import React, {Component} from 'react';
import { DragSource } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { ResizableBox } from 'react-resizable';

const widgetSource = {

    beginDrag(props) {
        const { id, type, left, top, width, height } = props;
        return { id, type, left, top, width, height }
    },

    /*endDrag(props, monitor, component) {
        if (!monitor.didDrop()) {
            return;
        }

        const item = monitor.getItem();
        const dropResult = monitor.getDropResult();
    }*/
};


function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging(),
        didDrop: monitor.didDrop(),
    };
}

function getStyles(props) {

    const {left, top, isDragging, preview} = props;
    const transform = `translate3d(${left}px, ${top}px, 0)`;

    return {
        position: 'absolute',
        transform,
        WebkitTransform: transform,
        // IE fallback: hide the real node using CSS when dragging
        // because IE will ignore our custom "empty image" drag preview.
        opacity: isDragging ? 0 : 1,
        height: isDragging ? 0 : '',
        zIndex: 1,
        boxShadow: preview ?
            '0 2px 2px 0 rgba(0, 0, 0, 0.25), 0 0px 2px 0 rgba(0, 0, 0, 0.25)' :
            '0 1px 1px 0 rgba(0, 0, 0, 0.15), 0 0px 1px 0 rgba(0, 0, 0, 0.15)',
        background: 'white',
    }
}


class Widget extends Component {

    constructor(props){
        super(props);
    }

    componentDidMount() {
        this.props.connectDragPreview(getEmptyImage(), {
            captureDraggingState: true,
        })
    }

    preventDndOnResize(event){
        event.stopPropagation();
        event.preventDefault();
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

    render() {

        const { id } = this.props;

        const { isDragging, connectDragSource } = this.props;

        return connectDragSource(
            <div style={getStyles(this.props)}>
                <div>
                    <ResizableBox width={this.props.width || 150} height={this.props.height || 150} minConstraints={[150, 150]} maxConstraints={[450, 450]}
                                  draggableOpts={{grid: [15, 15]}} onResizeStart={(event)=>this.preventDndOnResize(event)}
                                  onResizeStop={(event, data)=>this.saveResize(event, data)} onMouseDown={()=> this.props.handleSelect(id)}>
                        {this.props.children}
                    </ResizableBox>
                </div>
            </div>
        );
    }
}

export default DragSource('widget', widgetSource, collect)(Widget);
