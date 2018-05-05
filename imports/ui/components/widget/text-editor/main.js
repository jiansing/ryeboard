/**
 * Created by JohnBae on 7/1/17.
 */

import React, {Component} from 'react';
import Core from '../core';
import {connectAdvanced} from "react-redux";
import equals from 'fast-deep-equal';
import {bindActionCreators} from 'redux';
import * as Actions from "/imports/redux/actions/main";
import {Editor, EditorState, RichUtils, convertFromRaw, convertToRaw} from 'draft-js';
import store from '/imports/redux/store';
import 'draft-js/dist/Draft.css'

class PureTextEditor extends Component{

    constructor(props) {
        super(props);

        let saved = props.savedEditorState;
        console.log(saved);
        this.state = {
            focused: false,
            editorState: saved ? saved : EditorState.createEmpty()
        };

        this.handleKeyCommand = this.handleKeyCommand.bind(this);
    }

    componentWillMount(){
        console.log('mounting...', this.state.editorState);
        if(this.state.editorState === null){
            let id = this.props.id;
        }
    }

    makeMutable(){
        let content = this.state.editorState.getCurrentContent();
        let raw = convertToRaw(content);
        let id = this.props.id;
        console.log('saving as:', raw);
        this.props.actions.modifyBoard({id, data: {editorState: raw}});
        this.props.actions.setMutable();
        Meteor.call('boards.update', store.getState());
    }

    handleEdit(editorState){
        let id = this.props.id;
        this.setState({editorState: editorState});
        //this.props.actions.modifyBoard({id, data: {editorState: editorState}})
    }

    handleKeyCommand(command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.handleEdit(newState);
            return 'handled';
        }
        return 'not-handled';
    }

    onBoldClick() {
        const newState = RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD');
        if(newState)  this.handleEdit(newState);
    }

    onItalicClick() {
        const newState = RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC');
        if(newState)  this.handleEdit(newState);
    }

    onUnderlineClick() {
        const newState = RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE');
        if(newState)  this.handleEdit(newState);
    }

    compileMenu(){
        let bold = {
                condition: ()=> true,
                icon: null,
                title: ()=> 'bold',
                fun: ()=> this.onBoldClick()
            },
            italic = {
                condition: ()=> true,
                icon: null,
                title: () => 'italic',
                fun: ()=> this.onItalicClick()
            },
            underline = {
                condition: ()=> true,
                icon: null,
                title: () => 'underline',
                fun: ()=> this.onUnderlineClick()
            }

        return [bold, italic, underline];
    }

    handleKey(event){
        let key = event.keyCode;

        if(this.focusSink===document.activeElement)
        switch(key){
            case 8 : {
                this.props.actions.removeFromBoard(this.props.id);
                this.props.actions.setMutable();
                Meteor.call('boards.update', store.getState());
            }
        }

        event.stopPropagation();
    }

    render(){
        return(
            <Core selected={this.state.focused} {...this.props}>
                <div style={{position: 'absolute', height: '100%', width: '100%', zIndex: this.state.focused ? -1 : 3}}
                     onClick={(event)=> {
                         if(event.shiftKey) {
                             this.focusSink.focus();
                         }
                         else {
                             this.editor.focus();
                         }
                     }}/>
                <div style={{height: '100%', width: '100%', overflowY: 'auto', padding: '15px', outline: 'none'}} tabIndex={-1}
                     ref={(focusSink)=>this.focusSink = focusSink}
                     onKeyUp={(event)=>this.handleKey(event)}
                     onBlur={()=>{
                         this.props.actions.deselectWidgetFromBoard();
                         this.setState({focused: false});
                     }}
                     onFocus={()=>{
                         console.log("has div focus");
                         this.props.handleSelect(this.props.id, this.compileMenu());
                         this.setState({focused: true});
                     }}>
                    <Editor editorState={this.state.editorState}
                            onBlur={()=>{
                                console.log("lost editor focus");
                                this.props.actions.deselectWidgetFromBoard();
                                this.makeMutable();
                                this.setState({focused: false});
                            }}
                            onFocus={()=>{
                                console.log("has editor focus");
                                this.props.handleSelect(this.props.id, this.compileMenu());
                                this.setState({focused: true});
                            }}
                            onChange={(editorState)=>this.handleEdit(editorState)}
                            handleKeyCommand={this.handleKeyCommand}
                            handleDrop={()=>true} placeholder={'write something!'}
                            ref={(editor)=> this.editor = editor}/>
                </div>
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
            savedEditorState: function() {
                let editor = nextState.boardLayout.find((elem)=>elem.id === nextOwnProps.id);
                if(editor && editor.data) {
                    let state = EditorState.createWithContent(convertFromRaw(editor.data.editorState));
                    return state;
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

export default connectAdvanced(selector)(PureTextEditor)