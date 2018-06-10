import React, { Component } from 'react'
import { DragLayer } from 'react-dnd'
import Widget from '../widget/main';

function getItemStyles(props) {
    const { initialOffset, currentOffset, zoomValue } = props;
    if (!initialOffset || !currentOffset) {
        return {
            display: 'none',
        }
    }


    let { x, y } = currentOffset;

    const transform = `translate(${x / zoomValue}px, ${y / zoomValue}px)`;
    return {
        transform,
        WebkitTransform: transform,
    }
}

class PureDragLayer extends Component {

    renderItem(type, item, offsetTop, offsetLeft) {

        switch (type) {
            case 'widget':
                return  <Widget key={item.id} id={item.id} type={item.type}
                                offsetTop={offsetTop} offsetLeft={offsetLeft} preview/>;
            case 'widgetPreview':
                return  <Widget key={item.id} id={item.id} type={item.type}
                                width={item.width} left={item.left} preview/>;
            default:
                return null;
        }
    }

    render() {
        const { item, itemType, isDragging } = this.props;

        if (!isDragging) {
            return null
        }

        let widgets = Array.isArray(item.selectedWidgets) ?
            item.selectedWidgets.map((elem, index)=> this.renderItem(itemType, elem, item.offsetTop, item.offsetLeft)) :
            this.renderItem(itemType, item);

        return (
            <div style={{
                position: 'fixed',
                pointerEvents: 'none',
                zIndex: 100,
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                transform: this.props.zoomScale || '',
                transformOrigin: '0 0'
            }} className={'board-drag'}>
                <div style={getItemStyles(this.props)}>
                    {widgets}
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

export default DragLayer(collect)(PureDragLayer);