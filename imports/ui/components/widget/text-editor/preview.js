/**
 * Created by JohnBae on 7/1/17.
 */

import React, {Component} from 'react';
import PreviewCore from '../widgetPreview';
import {EditorState} from 'draft-js';

/**
 * How the note widget preview looks on the menu
 */
export default class Preview extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <PreviewCore icon='/icons/note.svg' height={150} width={300} type={'note'}/>
        )
    }
}