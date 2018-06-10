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
                document.getElementById('board-container').scrollTop || 0,
            left = document.getElementById('board-container').pageXOffset ||
                document.getElementById('board-container').scrollLeft || 0,
            width = props.width || 150,
            height = props.height || 150;

        let topOffset = document.getElementById('preview-' + props.type).parentElement.offsetTop + 5,
            leftOffset = document.getElementById('preview-' + props.type).parentElement.offsetLeft + 10;

        console.log('top offset:', topOffset, '\nleftOffset:', leftOffset, '\ntop:', top, '\nleft:',left);

        top += topOffset;
        left -= 75 - leftOffset;

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

const styles = {
    position: 'relative',
    background: 'transparent',
    width: '100%'

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
            <div style={styles} id={'preview-'+this.props.type}>
                <div style={{textAlign: 'center'}}>
                    <img src={this.props.icon} height={25} width={25} />
                    <p style={{margin: '0'}}>{this.props.type}</p>
                </div>
            </div>
        );
    }
}

export default DragSource('widgetPreview', widgetSource, collect)(Widget);
