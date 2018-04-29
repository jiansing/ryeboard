import React, { Component } from 'react'
import { DragLayer } from 'react-dnd'
import snapToGrid from '/imports/helper/snapToGrid'
import Widget from '../widget/main';

const layerStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
};

function getItemStyles(props) {
    const { initialOffset, currentOffset } = props;
    if (!initialOffset || !currentOffset) {
        return {
            display: 'none',
        }
    }

    let { x, y } = currentOffset

    const transform = `translate(${x}px, ${y}px)`;
    return {
        transform,
        WebkitTransform: transform,
    }
}

class CustomDragLayer extends Component {


    renderItem(type, item) {
        switch (type) {
            case 'widget':
                return  <Widget key={item.key} id={item.id} type={item.type}
                                preview data={item.data}
                                width={item.width} height={item.height}/>;
            case 'widgetPreview':
                return  <Widget key={item.key} id={item.id} type={item.type}
                                preview data={item.data}
                                width={item.width} height={item.height}/>;
            default:
                return null;
        }
    }

    render() {
        const { item, itemType, isDragging } = this.props;

        if (!isDragging) {
            return null
        }
        return (
            <div style={layerStyles}>
                <div style={getItemStyles(this.props)}>
                    {this.renderItem(itemType, item)}
                </div>
            </div>
        )
    }
}

function collect(monitor) {
    return {
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        initialOffset: monitor.getInitialSourceClientOffset(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
    };
}

export default DragLayer(collect)(CustomDragLayer);