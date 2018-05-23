import React, { Component } from 'react'
import { DragLayer } from 'react-dnd'
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

class PureDragLayer extends Component {

    componentDidMount(){
        console.log('mounted drag layer');
    }

    renderItem(type, item, offsetTop, offsetLeft) {

        switch (type) {
            case 'widget':
                return  <Widget key={item.id} id={item.id} type={item.type} preview offsetTop={offsetTop} offsetLeft={offsetLeft}/>;
            case 'widgetPreview':
                return  <Widget key={item.id} id={item.id} type={item.type} preview/>;
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
            <div style={layerStyles}>
                <div style={getItemStyles(this.props)}>
                    {widgets}
                    {/*this.renderItem(itemType, item)*/}
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