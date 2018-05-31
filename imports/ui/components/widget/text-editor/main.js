/**
 * Created by JohnBae on 7/1/17.
 */

import React, {Component} from 'react';
import Core from '../core';
import {connectAdvanced} from "react-redux";
import equals from 'react-fast-compare';
import {bindActionCreators} from 'redux';
import * as Actions from "/imports/redux/actions/main";

import {EditorState, RichUtils, convertFromRaw, convertToRaw} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createAutoListPlugin from 'draft-js-autolist-plugin'

import 'draft-js/dist/Draft.css'
import store from '/imports/redux/store';

let linkify = createLinkifyPlugin({
    component: (props) => (
        // eslint-disable-next-line no-alert, jsx-a11y/anchor-has-content
        <a {...props} onClick={() => window.open(props.href)} />
    )
});

const autoListPlugin = createAutoListPlugin()

let plugins = [linkify, autoListPlugin];

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

    componentDidMount(){

    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(prevState.editorState && nextProps.savedEditorState && nextProps.shouldUpdate){
            //if(prevState.editorState) console.log('old state -', convertToRaw(prevState.editorState.getCurrentContent()));
            let newEditorContent = convertFromRaw(nextProps.savedEditorState);
            prevState.editorState = EditorState.createWithContent(newEditorContent);
            //console.log('updating' +  nextProps.id +' with new props:', nextProps.savedEditorState);
        }

        return prevState;
    }

    makeMutable(){
        let content = this.state.editorState.getCurrentContent();
        let raw = convertToRaw(content);
        let id = this.props.id;
        this.props.actions.modifyBoard({id, data: {editorState: raw}});
        this.props.actions.setMutable();
        if(Meteor.user()) Meteor.call('boards.update', store.getState());
    }

    handleEdit(editorState){

        let content = editorState.getCurrentContent();
        let raw = convertToRaw(content);
        let id = this.props.id;
        this.props.actions.modifyBoard({id, data: {style: [
            editorState.getCurrentInlineStyle().has('BOLD'),
            editorState.getCurrentInlineStyle().has('ITALIC'),
            editorState.getCurrentInlineStyle().has('UNDERLINE')
        ]}});

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
                selected: (context) => context.style ? context.style[0] : false,
                icon: '/icons/bold-text.svg',
                title: ()=> 'bold',
                fun: (test)=> this.onBoldClick(test)
            },
            italic = {
                condition: ()=> true,
                selected: (context) => context.style ? context.style[1] : false,
                icon: '/icons/italic-text.svg',
                title: () => 'italic',
                fun: ()=> this.onItalicClick()
            },
            underline = {
                condition: ()=> true,
                selected: (context) => context.style ? context.style[2] : false,
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
                  menu={()=>this.compileMenu()}
                  {...this.props}>
                <div style={{position: 'absolute', height: '100%', width: '100%', zIndex: this.state.focused ? -1 : 3}}
                     onClick={(event)=> {
                         if(event.shiftKey && !this.state.focused) {
                             this.setState({focused: false});
                         }
                         else{
                             this.setState({focused: true});
                             this.editor.focus();
                         }
                     }}/>
                <div style={{height: '100%', width: '100%', overflowY: 'auto', padding: '15px', outline: 'none'}}
                     onClick={()=> this.editor.focus()}
                     onBlur={()=>{
                         this.setState({focused: false});
                     }}
                     onFocus={()=>{
                         this.setState({focused: true});
                     }}>
                    <Editor editorState={this.state.editorState}
                            readOnly={!this.state.focused}
                            plugins={plugins}
                            onBlur={()=>{
                                let editor = EditorState.set(this.state.editorState, {allowUndo: false});
                                this.setState({focused: false, editorState: editor});
                                this.makeMutable();
                            }}
                            onFocus={()=>{
                                let editor = EditorState.set(this.state.editorState, {allowUndo: true});
                                this.setState({focused: true, editorState: editor});
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
                let editor = nextState.boardLayout.find((elem)=>elem.id === nextOwnProps.id);
                if(editor && editor.data) {
                    return editor.data.editorState;
                }
                else return null;
            }(),
            ...nextOwnProps
        };

        nextResult.shouldUpdate = true;

        if(!equals(nextResult, result)){
            result = nextResult;
        }

        return result
    }
}

export default connectAdvanced(selector)(PureTextEditor)