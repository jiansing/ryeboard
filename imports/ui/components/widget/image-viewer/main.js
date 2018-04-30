/**
 * Created by JohnBae on 7/1/17.
 */

import React, {Component} from 'react';
import Core from '../core';
import {connectAdvanced} from "react-redux";
import equals from 'fast-deep-equal';
import {bindActionCreators} from 'redux';
import * as Actions from "/imports/redux/actions/main";
import { DropTarget, connectDropTarget } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend';

const ImageTarget = {
    drop(props, monitor, component) {

        let item = monitor.getItem();
        if(item.files){
            let data  = URL.createObjectURL(monitor.getItem().files[0]);
            component.setImage(data);
        }
        if(item.urls){
            let data  = item.urls[0];
            if(!/\.(jpg|gif|png)$/.test(data)) return;
            component.setImage(data);
        }
    },
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
}

class PureImageViewer extends Component{

    constructor(props){
        super(props);
        this.state = {
            selected: false,
            background: null,
            maxSize: null,
            minSize: null
        }
    }

    setImage(image){
        let id = this.props.id;
        this.props.actions.modifyBoard({id, data: {image: image}});
        this.props.actions.setMutable();
    }

    sizeToGrid(size){
        let {width, height} = size;

        let widthOffset = width % 15,
            heightOffset = height % 15;

        if(widthOffset > 7)  width += 15 - widthOffset;
        else width -= widthOffset;

        if(heightOffset > 7)  height += 15 - heightOffset;
        else height -= heightOffset;

        let newHeight = height,
            newWidth = width;

        return {newHeight, newWidth};
    }

    lockAspectRatio(){
        if(!this.props.imageData) return '';

        let id = this.props.id,
            currentWidth = this.props.width,
            currentHeight = this.props.height,
            maxWidth = this.props.maxWidth,
            maxHeight = this.props.maxHeight;

        let ratio, newWidth, newHeight, minSize;

        if(this.image.naturalWidth < this.image.naturalHeight){
            ratio = this.image.naturalHeight / this.image.naturalWidth;
            newWidth = currentWidth;
            newHeight = ratio * currentWidth;
            minSize = [90, ratio * 90]
        }
        else{
            ratio = this.image.naturalWidth / this.image.naturalHeight;
            newWidth = ratio * currentHeight;
            newHeight = currentHeight;
            minSize = [ratio * 90, 90]
        }

        this.props.actions.modifyBoard({id,  width: newWidth, height: newHeight, maxSize: [Infinity, Infinity],
            minSize: minSize, data: {ratio: true} });
        this.props.actions.setMutable();
    }

    unlockAspectRatio(){
        let {id} = this.props;
        this.setState({ratio: false});
        this.props.actions.modifyBoard({id,  maxSize: [Infinity, Infinity],
            minSize: [90, 90], data: {ratio: false}  });
        this.props.actions.setMutable();
    }

    compileMenu(context){
        let ratio = {
            condition: (data)=> typeof data !== 'undefined' && typeof data.image !== 'undefined' && data.image,
            icon: null,
            title: (data) => {if(data) return data.ratio ? 'unset ratio' : 'set ratio'},
            fun: (data)=> {if(data)  return data.ratio ? this.unlockAspectRatio() : this.lockAspectRatio()}
        };
        return [ratio];
    }

    handleKey(event){
        let key = event.keyCode;

        switch(key){
            case 8 : {
                this.props.actions.removeFromBoard(this.props.id);
                this.props.actions.setMutable();
            }
        }
    }

    render(){

        const { connectDropTarget } = this.props;

        return (
            <Core selected={this.state.focused}
                  resizeOpts={{lockAspectRatio: this.props.ratio}}
                  {...this.props}>
                {connectDropTarget(
                    <div style={{height: '100%', width: '100%', background: 'white'}}
                         className={this.props.isOver ? 'dustbin open' : 'dustbin'}>
                        <div style={{position: 'absolute', height: '100%', width: '100%', zIndex: this.state.focused ? -1 : 3}}
                             onClick={()=> {
                                 this.preview.focus()
                             }}/>
                        <div style={{width: '100%', height: '100%', outline: 'none'}}>
                            {this.props.imageData && !this.props.preview ?
                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center',
                                    height: '100%', width: '100%', textAlign: 'center', outline: 'none'}}
                                     tabIndex={-1} ref={(preview) => this.preview = preview}
                                     onKeyUp={(event)=>this.handleKey(event)}
                                     onBlur={()=>{
                                         this.props.actions.deselectWidgetFromBoard();
                                         this.setState({focused: false});
                                     }}
                                     onFocus={()=>{
                                         this.props.handleSelect(this.props.id, this.compileMenu());
                                         this.setState({focused: true});
                                     }}>
                                    <img ref={(image) => this.image = image} src={this.props.imageData} style={{height: '100%', width: '100%', outline: 'none', pointerEvents: 'none'}}/>
                                </div> :
                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center',
                                    height: '100%', width: '100%', textAlign: 'center', padding: '5px', outline: 'none'}}
                                     tabIndex={-1} ref={(preview) => this.preview = preview}
                                     onKeyUp={(event)=>this.handleKey(event)}
                                     onBlur={()=>{
                                         this.props.actions.deselectWidgetFromBoard();
                                         this.setState({focused: false});
                                     }}
                                     onFocus={()=>{
                                         this.props.handleSelect(this.props.id, this.compileMenu());
                                         this.setState({focused: true});
                                     }}>
                                    <h4>{this.props.preview ? 'Image' : 'Drag an Image here'}</h4>
                                </div>}
                        </div>
                    </div>
                )}
            </Core>
        )
    }
}

function selector(dispatch) {
    let result = {};
    const actions = bindActionCreators(Actions, dispatch);
    return (nextState, nextOwnProps) => {

        nextState = nextState.undoable.present;

        const nextResult = {
            actions: actions,
            selectedSelf: nextState.boardLogic.selected && nextState.boardLogic.selected.id === nextOwnProps.id,
            imageData: function() {
                let viewer = nextState.boardLayout.find((elem)=>elem.id === nextOwnProps.id);
                if(viewer && viewer.data) {
                    return viewer.data.image;
                }
                else return null;
            }(),
            ratio: function(){
                let viewer = nextState.boardLayout.find((elem)=>elem.id === nextOwnProps.id);
                if(viewer && viewer.data) {
                    return viewer.data.ratio;
                }
                else return null;
            }(),
            ...nextOwnProps
        };

        if(!equals(nextResult, result)){
            result = nextResult;
        }
        return result
    }
}

let DndImageViewer = DropTarget([NativeTypes.FILE, NativeTypes.URL], ImageTarget, collect)(PureImageViewer);
export default connectAdvanced(selector)(DndImageViewer)