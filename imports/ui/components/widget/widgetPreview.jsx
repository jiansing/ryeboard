import React, {Component} from 'react';
import { DragSource } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { ResizableBox } from 'react-resizable';

const widgetSource = {
    beginDrag(props) {
        let newWidget = true,
            type = props.type,
            top = document.getElementById('board-container').pageYOffset ||
                document.getElementById('board-container').scrollTop ||
                document.getElementById('board-container').scrollTop || 0,
            left = document.getElementById('board-container').pageXOffset ||
                document.getElementById('board-container').scrollLeft ||
                document.getElementById('board-container').scrollLeft || 0,
            width = 150,
            height = 150;

        console.log(this);
        top += document.getElementById('preview-' + props.type).offsetTop;
        left -= 75;

        return { type, left, top, width, height, newWidget }
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

        const { isDragging, connectDragSource } = this.props;

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
