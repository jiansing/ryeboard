/**
 * Created by JohnBae on 7/1/17.
 */

import React, {Component} from 'react';
import Core from '../core';

export default class Preview extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <Core {...this.props}>
                Hello there! I'm Image Viewer
            </Core>
        )
    }
}