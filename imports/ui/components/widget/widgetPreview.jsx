import React, {Component} from 'react';
import { DragSource } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { ResizableBox } from 'react-resizable';

const widgetSource = {
    beginDrag(props) {
        let newWidget = true,
            type = props.type,
            data = props.data,
            top = document.getElementById('board-container').pageYOffset ||
                document.getElementById('board-container').scrollTop ||
                document.getElementById('board-container').scrollTop || 0,
            left = document.getElementById('board-container').pageXOffset ||
                document.getElementById('board-container').scrollLeft ||
                document.getElementById('board-container').scrollLeft || 0,
            width = props.width || 150,
            height = props.height || 150;

        top += document.getElementById('preview-' + props.type).offsetTop;
        left -= 75;

        return { type, data, left, top, width, height, newWidget }
    },
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
    return {
        position: 'relative',
        boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.15), 0 0px 1px 0 rgba(0, 0, 0, 0.15)',
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

    render() {

        const { id } = this.props;

        const { connectDragSource } = this.props;

        return connectDragSource(
            <div style={getStyles(this.props)} id={'preview-'+this.props.type}>
                <div style={{textAlign: 'center'}}>
                    <div style={{width: '100%', height: '25px', background: 'black'}} />
                    {this.props.type}
                </div>
            </div>
        );
    }
}

export default DragSource('widgetPreview', widgetSource, collect)(Widget);
