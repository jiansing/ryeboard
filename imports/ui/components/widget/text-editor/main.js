/**
 * Created by JohnBae on 7/1/17.
 */

import React, {Component} from 'react';
import Core from '../core';
import {connectAdvanced} from "react-redux";
import equals from 'react-fast-compare';
import {bindActionCreators} from 'redux';
import * as Actions from "/imports/redux/actions/main";
import {Editor, EditorState, RichUtils, convertFromRaw, convertToRaw} from 'draft-js';
import 'draft-js/dist/Draft.css'
import store from '/imports/redux/store';

class PureTextEditor extends Component{

    constructor(props) {
        super(props);

        let saved = props.savedEditorState ? EditorState.createWithContent(convertFromRaw(props.savedEditorState)) : null;
        this.state = {
            focused: false,
            editorState: saved ? saved : EditorState.createEmpty()
        };

        this.handleKeyCommand = this.handleKeyCommand.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.savedEditorState && nextProps.shouldUpdate)
        prevState.editorState = EditorState.createWithContent(convertFromRaw(nextProps.savedEditorState));

        return prevState;
    }

    makeMutable(){
        console.log('making text mutable');
        let content = this.state.editorState.getCurrentContent();
        let raw = convertToRaw(content);
        let id = this.props.id;
        this.props.actions.modifyBoard({id, data: {editorState: raw}});
        this.props.actions.setMutable();
        Meteor.call('boards.update', store.getState());
    }

    handleEdit(editorState){
        console.log('handling edit');
        this.setState({editorState: editorState});
    }

    handleKeyCommand(command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.handleEdit(newState);
            return 'handled';
        }
        return 'not-handled';
    }

    onBoldClick(test) {
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
                selected: () => this.state.editorState.getCurrentInlineStyle().has('BOLD'),
                icon: '/icons/bold-text.svg',
                title: ()=> 'bold',
                fun: (test)=> this.onBoldClick(test)
            },
            italic = {
                condition: ()=> true,
                selected: (data) => this.state.editorState.getCurrentInlineStyle().has('ITALIC'),
                icon: '/icons/italic-text.svg',
                title: () => 'italic',
                fun: ()=> this.onItalicClick()
            },
            underline = {
                condition: ()=> true,
                selected: (data) => this.state.editorState.getCurrentInlineStyle().has('UNDERLINE'),
                icon: '/icons/underline-text.svg',
                title: () => 'underline',
                fun: ()=> this.onUnderlineClick()
            }

        return [bold, italic, underline];
    }

    render(){
        return(
            <Core selected={this.props.selected}
                  focused={this.state.focused}
                  menu={this.props.preview ? null : ()=>this.compileMenu()}
                  {...this.props}>
                <div style={{position: 'absolute', height: '100%', width: '100%', zIndex: this.state.focused ? -1 : 3}}
                     onClick={(event)=> {
                         if(!event.shiftKey) {
                             this.editor.focus();
                             event.stopPropagation();
                         }
                         else{
                             this.editor.blur();
                         }
                     }}/>
                <div style={{height: '100%', width: '100%', overflowY: 'auto', padding: '15px', outline: 'none'}} tabIndex={-1}
                     onBlur={()=>{
                         this.setState({focused: false});
                     }}
                     onFocus={()=>{
                         this.setState({focused: true});
                     }}
                     ref={(focusSink)=>this.focusSink = focusSink}>
                    <Editor editorState={this.state.editorState}
                            onBlur={()=>{
                                this.makeMutable();
                                this.setState({focused: false});
                            }}
                            onFocus={()=>{
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
            selected: nextState.boardLogic.selected,
            savedEditorState: function() {
                let editor = nextState.boardLayout.find((elem)=>elem.id === nextOwnProps.id);
                if(editor && editor.data) {
                    return editor.data.editorState;
                }
                else return null;
            }(),
            ...nextOwnProps
        };

        nextResult.shouldUpdate = !equals(nextResult.savedEditorState, result.savedEditorState);

        if(!equals(nextResult, result)){
            if(nextResult.selected) {
                let selection = nextResult.selected;
                if(Array.isArray(selection)){
                    nextResult.selected = selection.findIndex((elem)=> elem.id === nextOwnProps.id) !== -1
                }
                else if(selection){
                    nextResult.selected = selection.id === nextOwnProps.id;
                }
                else nextResult.selected = false;
            }
            result = nextResult;
        }
        return result
    }
}

export default connectAdvanced(selector)(PureTextEditor)