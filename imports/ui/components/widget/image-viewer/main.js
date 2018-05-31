/**
 * Created by JohnBae on 7/1/17.
 */

import React, {Component} from 'react';
import Core from '../core';
import {connectAdvanced} from "react-redux";
import equals from 'react-fast-compare';
import {bindActionCreators} from 'redux';
import * as Actions from "/imports/redux/actions/main";
import { DropTarget, connectDropTarget } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend';
import isUrlImage from '/imports/helper/isUrlImage';
import store from '/imports/redux/store';

import getAspectRatio from './tools/getAspectRatio';
import ReactCrop from 'react-image-crop';
import rotateImage from './tools/rotate';

const ImageTarget = {
    drop(props, monitor, component) {

        let item = monitor.getItem();
        if(item.files){

            if(Meteor.user()){
                let uploader = new Slingshot.Upload("userImageUploads");
                uploader.send(monitor.getItem().files[0], function (error, downloadUrl) {
                    if (error) {
                        alert (error);
                    }
                    else {
                        component.setImage(downloadUrl);
                    }
                });
            }
            else{
                let data  = URL.createObjectURL(monitor.getItem().files[0]);
                component.setImage(data);
            }
        }
        if(item.urls){
            let data  = item.urls[0];

            /*console.log('pasting image from url');

            let xhr = new XMLHttpRequest();
            xhr.open('GET', data, true);

            xhr.responseType = 'arraybuffer';

            xhr.onload = function(e) {
                if (this.status === 200) {
                    let uInt8Array = new Uint8Array(this.response);

                    for (let i = 0, len = uInt8Array.length; i < len; ++i) {
                        uInt8Array[i] = this.response[i];
                    }

                    let byte3 = uInt8Array[4];

                    console.log("data:image/png;base64," + byte3, uInt8Array);
                }
            }

            xhr.send();*/

            isUrlImage(data, ()=>  component.setImage(data), 10000);
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
        console.log('setting image...', this.props.id);
        let id = this.props.id;
        this.props.actions.modifyBoard({id, data: {image: image}});
        this.props.actions.setMutable();
        if(Meteor.user()) Meteor.call('boards.update', store.getState());
    }

    lockAspectRatio(){
        if(!this.props.imageData) return '';

        let id = this.props.id,
            currentWidth = this.props.width,
            currentHeight = this.props.height;

        let aspectRatio = getAspectRatio(this.image, currentWidth, currentHeight);

        this.props.actions.modifyBoard({id,  width: aspectRatio.width, height: aspectRatio.height,
            maxSize: [Infinity, Infinity], minSize: aspectRatio.minSize, data: {ratio: true} });
        this.props.actions.setMutable();
        if(Meteor.user()) Meteor.call('boards.update', store.getState());
    }

    unlockAspectRatio(){
        let {id} = this.props;
        this.setState({ratio: false});
        this.props.actions.modifyBoard({id,  maxSize: [Infinity, Infinity],
            minSize: [150, 150], data: {ratio: false}  });
        this.props.actions.setMutable();
        if(Meteor.user()) Meteor.call('boards.update', store.getState());
    }

    compileMenu(context){

        let self = this;

        let ratio = {
            condition: (data)=> typeof data !== 'undefined' && typeof data.image !== 'undefined' && data.image,
            icon: '/icons/ratio.svg',
            title: (data) => {if(data) return data.ratio ? 'unlock ratio' : 'lock ratio'},
            fun: (data)=> {if(data)  return data.ratio ? this.unlockAspectRatio() : this.lockAspectRatio()}
        };

        let rotate = {
            condition: (data)=> typeof data !== 'undefined' && typeof data.image !== 'undefined' && data.image,
            icon: '/icons/ratio.svg',
            title: () => 'rotate',
            fun: (data)=> {if(data) rotateImage(this.image, function(tempImage, image) {
                self.setImage(tempImage);
                let uploader = new Slingshot.Upload("userImageUploads");
                uploader.send(image, function (error, downloadUrl) {
                    if (error) {
                        alert(error);
                    }
                    else {
                        if(tempImage === self.image.src) self.setImage(downloadUrl);
                    }
                });
            })}
        };

        let spotlight = {
            condition: (data)=> typeof data !== 'undefined' && typeof data.image !== 'undefined' && data.image,
            icon: '/icons/ratio.svg',
            title: (data) => {if(data) return data.ratio ? 'unlock ratio' : 'lock ratio'},
            fun: (data)=> {if(data)  return data.ratio ? this.unlockAspectRatio() : this.lockAspectRatio()}
        };

        let crop = {
            condition: (data)=> typeof data !== 'undefined' && typeof data.image !== 'undefined' && data.image,
            icon: '/icons/ratio.svg',
            title: (data) => {if(data) return data.ratio ? 'unlock ratio' : 'lock ratio'},
            fun: (data)=> {if(data)  return data.ratio ? this.unlockAspectRatio() : this.lockAspectRatio()}
        };

        return [ratio, rotate];
    }

    render(){

        const { connectDropTarget } = this.props;

        return (
            <Core selected={this.props.selected}
                  focused={this.state.focused}
                  menu={() => this.compileMenu()}
                  minSize={ this.props.minSize || [150, 150]}
                  resizeOpts={{lockAspectRatio: this.props.ratio}}
                  {...this.props}>
                {connectDropTarget(
                    <div style={{height: '100%', width: '100%', background: 'white'}}
                         className={this.props.isOver ? 'dustbin open' : 'dustbin'}>
                        <div style={{position: 'absolute', height: '100%', width: '100%', zIndex: this.state.focused ? -1 : 3}}
                             onClick={(event)=> {
                                 this.preview.focus();
                                 event.stopPropagation();
                             }}/>
                        <div style={{width: '100%', height: '100%', outline: 'none'}}>
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center',
                                height: '100%', width: '100%', textAlign: 'center', outline: 'none'}}
                                 ref={(preview) => this.preview = preview}>
                                {this.props.imageData ?
                                    <img ref={(image) => this.image = image} src={this.props.imageData}
                                         crossOrigin={'anonymous'}
                                         style={{height: '100%', width: '100%', outline: 'none', pointerEvents: 'none'}}/>
                                    : <label style={{color: 'gray'}}>Drag or Paste an Image here</label>}
                            </div>
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

        let widget = nextState.boardLayout.find((elem)=>elem.id === nextOwnProps.id);

        const nextResult = {
            actions: actions,
            selected: function(){
                let selection = nextState.boardLogic.selected;

                if(Array.isArray(selection)){
                    return selection.findIndex((elem)=> elem.id === nextOwnProps.id) !== -1
                }
                else if(selection){
                    return selection.id === nextOwnProps.id;
                }
                else return false;
            }(),
            minSize: widget ? widget.minSize : null,
            imageData: function() {
                if(widget && widget.data) {
                    return widget.data.image;
                }
                else return null;
            }(),
            ratio: function(){
                if(widget && widget.data) {
                    return widget.data.ratio;
                }
                else return null;
            }(),
            ...nextOwnProps
        };

        if(!nextOwnProps.width && !nextOwnProps.height){
            let elem = nextState.boardLayout.find((elem)=>elem.id === nextOwnProps.id);

            nextResult.width = elem.width;
            nextResult.height = elem.height;
        }

        if(!equals(nextResult, result)){
            result = nextResult;
        }
        return result
    }
}

let DndImageViewer = DropTarget([NativeTypes.FILE, NativeTypes.URL], ImageTarget, collect)(PureImageViewer);
export default connectAdvanced(selector)(DndImageViewer)