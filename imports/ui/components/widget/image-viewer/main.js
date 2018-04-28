/**
 * Created by JohnBae on 7/1/17.
 */

import React, {Component} from 'react';
import Core from '../core';
import {connectAdvanced} from "react-redux";
import equals from 'fast-deep-equal';
import {bindActionCreators} from 'redux';
import * as Actions from "/imports/redux/actions/main";

class PureImageViewer extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <Core menu={[()=> console.log("hi"), ()=>console.log('bye')]} {...this.props}>
                <input ref={(focusSink) => this.focusSink = focusSink}
                       style={{height: '0', width: '0', position:'absolute', opacity: 0}}
                       onBlur={()=> this.props.actions.deselectWidgetFromBoard()}/>
                <div style={{height: '100%', width: '100%', padding: '10px'}}
                     onClick={()=> this.focusSink.focus()}>
                    <div ref={(viewer) => this.viewer = viewer}>
                        Drag an Image here
                    </div>
                </div>
            </Core>
        )
    }
}

function selector(dispatch) {
    let result = {};
    const actions = bindActionCreators(Actions, dispatch);
    return (nextState, nextOwnProps) => {

        const nextResult = {
            actions: actions,
            editorState: function() {
                if(nextOwnProps.data && nextOwnProps.data.editorState) return nextOwnProps.data.editorState;
                let editor = nextState.boardLayout.find((elem)=>elem.id === nextOwnProps.id);
                if(editor && editor.data) {
                    return editor.data.editorState;
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

export default connectAdvanced(selector)(PureImageViewer)