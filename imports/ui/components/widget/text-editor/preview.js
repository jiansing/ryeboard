/**
 * Created by JohnBae on 7/1/17.
 */

import React, {Component} from 'react';
import PreviewCore from '../widgetPreview';

export default class Preview extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <PreviewCore type={'text-editor'}/>
        )
    }
}