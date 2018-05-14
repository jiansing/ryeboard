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
import 'draft-js/dist/Draft.css'
import store from '/imports/redux/store';

class PureTextEditor extends Component{

    constructor(props) {
        super(props);

        let saved = props.savedEditorState;
        this.state = {
            focused: false,
            editorState: saved ? saved : EditorState.createEmpty()
        };

        this.handleKeyCommand = this.handleKeyCommand.bind(this);
    }

    componentWillMount(){
        if(this.state.editorState === null){
            let id = this.props.id;
        }
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
            <Core selected={this.props.selected} {...this.props}
                  focused={this.state.focused}
                  menu={()=>this.compileMenu()}>
                <div style={{position: 'absolute', height: '100%', width: '100%', zIndex: this.state.focused ? -1 : 3}}
                     onClick={(event)=> {
                         if(!event.shiftKey) {
                             this.editor.focus();
                             event.stopPropagation();
                         }
                     }}/>
                <div style={{height: '100%', width: '100%', overflowY: 'auto', padding: '15px', outline: 'none'}} tabIndex={-1}
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
            savedEditorState: function() {
                return null;
                let editor = nextState.boardLayout.find((elem)=>elem.id === nextOwnProps.id);
                if(editor && editor.data) {
                    console.log('converting from saved');
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