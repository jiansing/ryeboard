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
import EditCanvas from './tools/editCanvas';

/**
 * Image widget that enables users to upload images
 *
 * Unique data this widget uses is:
 *
 * ratio[true/false] - used to determine whether resizing should be done proportionally or not
 * loading[true/false] - used to determine if image is being loaded or not
 * image[*] - image file to be displayed
 */

/**
 * Function that figures out what to do with image data
 *
 * Either uploads image to S3 or uses local Object URL option to display images
 *
 * TODO: separate this into another file and use globally
 *
 * @param {file} file - image that needs to be displayed
 * @param {function} setImage - function on what to do after it decides
 */
function processImageData(file, setImage){
    file = file[0];

    if(Meteor.user()){
        let uploader = new Slingshot.Upload("userImageUploads");
        uploader.send(file, function (error, downloadUrl) {
            if (error) {
                alert (error);
            }
            else {
                setImage(downloadUrl);
            }
        });
    }
    else{
        let data  = URL.createObjectURL(file);
        setImage(data);
    }
}

const ImageTarget = {
    drop(props, monitor, component) {

        let item = monitor.getItem();
        if(item.files){

            processImageData(monitor.getItem().files, (image)=> component.setImage(image));

        }
        if(item.urls){
            let data  = item.urls[0];

            //only set if url is image
            isUrlImage(data, () =>  component.setImage(data), 10000);
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

    compileMenu(){

        let self = this;

        // lock / unlock ratio resizing
        let ratio = {
            condition: (data)=> typeof data !== 'undefined' && typeof data.image !== 'undefined' && data.image,
            icon: '/icons/ratio.svg',
            title: (data) => {if(data) return data.ratio ? 'unlock ratio' : 'lock ratio'},
            fun: (data)=> {if(data)  return data.ratio ? this.unlockAspectRatio() : this.lockAspectRatio()}
        };

        // open image edit
        let edit = {
            condition: (data)=> typeof data !== 'undefined' && typeof data.image !== 'undefined' && data.image,
            icon: '/icons/ratio.svg',
            title: () => 'Edit',
            fun: (context, data)=> self.props.actions.setSelectedWidgetData({edit: true})
        };

        // display image with native fileupload
        let uploadFile = {
            condition: (data)=> data == null || data.image == null,
            icon: '/icons/ratio.svg',
            title: (data) => 'upload image',
            fun: (data)=> this.input.click()
        };

        return [ratio, uploadFile, edit];
    }

    //Save image from edit tool
    uploadData(data){

        let self = this;

        let blobData = dataURItoBlob(data);

        blobData.name = 'raw';
        blobData.lastModifiedDate = new Date();

        if(Meteor.user()) processImageData([blobData], (image)=>{
            self.setImage(image)
        });
        else self.setImage(data);

        function dataURItoBlob(dataURI) {
            let binary = atob(dataURI.split(',')[1]);
            let array = [];
            for(let i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], {type: 'image/png'});
        }
    }

    relevantElement(){

        if(this.props.imageData){
            return(
                <div style={{width: '100%', height: '100%'}}>
                    <img ref={(image) => this.image = image}
                         crossOrigin={null}
                         src={this.props.imageData}
                         style={{height: '100%', width: '100%',
                             outline: 'none', pointerEvents: 'none'}}/>
                    {this.props.menuData && this.props.menuData.edit ?
                        <EditCanvas image={this.props.imageData}
                                    save={(data)=> this.uploadData(data)}
                                    onClose={() => this.props.actions.setSelectedWidgetData({edit: false})}
                                    width={this.props.width}
                                    height={this.props.height}/> : ''}
                </div>
            )
        }
        else{
            return(
                <label style={{color: 'gray'}}>Drag or Upload an Image here</label>
            )
        }
    }

    render(){

        const { connectDropTarget } = this.props;

        const Content = this.relevantElement();

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
                        <div style={{position: 'absolute', height: '100%', width: '100%', zIndex: this.state.focused ? -1 : -1}}
                             onClick={(event)=> {
                                 console.log('click consumption on focus filler')
                                 this.preview.focus();
                             }}/>
                        <div style={{width: '100%', height: '100%', outline: 'none'}}>
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center',
                                height: '100%', width: '100%', textAlign: 'center', outline: 'none'}}
                                 ref={(preview) => this.preview = preview}>
                                {Content}
                            </div>
                        </div>
                    </div>
                )}
                <input style={{height: "0px", width: "0px", display: 'none'}} type="file" id="input" accept="image/*"
                       onChange = {(event)=> processImageData(event.target.files, (image)=>this.setImage(image))} ref={(c)=> this.input = c}/>
            </Core>
        )
    }
}

function selector(dispatch) {
    let result = {};
    const actions = bindActionCreators(Actions, dispatch);
    return (nextState, nextOwnProps) => {

        nextState = nextState.undoable.present;

        //Prevent redoing selector if just dragging
        if(nextState.boardLogic.dragging && result.actions) {
            return result;
        };

        let widget = nextState.boardLayout.find((elem)=>elem.id === nextOwnProps.id);

        let selected = function(){
            let selection = nextState.boardLogic.selected;

            if(Array.isArray(selection)){
                return selection.findIndex((elem)=> elem.id === nextOwnProps.id) !== -1
            }
            else if(selection){
                return selection.id === nextOwnProps.id;
            }
            else return false;
        }();

        const nextResult = {
            actions: actions,
            selected: selected,
            minSize: widget ? widget.minSize : null,
            imageData: function() {
                if(widget && widget.data) {
                    return widget.data.image;
                }
                else return null;
            }(),
            menuData: selected ? function(){
                if(Array.isArray(nextState.boardLogic.selected)) {
                    return null;
                }
                return nextState.boardLogic.data;
            }() : null,
            ratio: function(){
                if(widget && widget.data) {
                    return widget.data.ratio;
                }
                else return null;
            }(),
            ...nextOwnProps
        };

        // Apply default height and width if not specified
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