/**
 * Created by JohnBae on 7/1/17.
 */

import React, {Component} from 'react';
import PreviewCore from '../widgetPreview';

/**
 * How the image widget preview looks on the menu
 */
export default class Preview extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <PreviewCore icon='/icons/image.svg' height={150} width={150} type={'image'}/>
        )
    }
}