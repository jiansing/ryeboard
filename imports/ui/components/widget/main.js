/**
 * Created by JohnBae on 7/1/17.
 */

import React, { Component } from 'react'

import TextEditor from './text-editor/main';
import TextEditorPreview from './text-editor/preview';

import ImageViewer from './image-viewer/main';
import ImageViewerPreview from './image-viewer/preview';

let previews = [TextEditorPreview, ImageViewerPreview];

export {previews};

export default class Widget extends Component {
    constructor(props){
        super(props)
    }

    render(){

        switch(this.props.type){
            case 'text-editor' : return(
                <TextEditor {...this.props}/>
            )
            case 'image-viewer' : return(
                <ImageViewer {...this.props}/>
            )
        }
    }
}