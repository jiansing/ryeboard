/**
 * Created by JohnBae on 7/1/17.
 */

import * as types from '../constants/actionTypes';
import deepChange from 'updeep';

const DEFAULT_STATE = [ { "id" : 4, "data" : { "image" : "https://images.unsplash.com/photo-1481016964032-cb4d2741b2a7?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=9689874f947412ebd60c6429685fd914&auto=format&fit=crop&w=668&q=80" }, "left" : 195, "top" : 330, "height" : 270, "width" : 240, "type" : "image" }, { "id" : 5, "data" : { "image" : "https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=f75361bb535d798b9936d0b3f53e9cd3&auto=format&fit=crop&w=800&q=80" }, "left" : 480, "top" : 615, "height" : 330, "width" : 255, "type" : "image" }, { "id" : 2, "type" : "note", "left" : 750, "top" : 330, "width" : 375, "height" : 270, "data" : { "editorState" : { "blocks" : [ { "key" : "b1sn9", "text" : "3. There are only... two widgets...?", "type" : "unstyled", "depth" : 0, "inlineStyleRanges" : [ { "offset" : 0, "length" : 36, "style" : "BOLD" } ], "entityRanges" : [ ], "data" : {  } }, { "key" : "53sot", "text" : "Yea, the project has only been around for a couple of weeks and is currently in closed-beta and I wanted you to check it out first!", "type" : "unstyled", "depth" : 0, "inlineStyleRanges" : [ ], "entityRanges" : [ ], "data" : {  } }, { "key" : "3ahk6", "text" : "There's going to be many more features added in the future and I'll take any input from you guys. You can take a look at the current roadmap here:  ", "type" : "unstyled", "depth" : 0, "inlineStyleRanges" : [ ], "entityRanges" : [ ], "data" : {  } }, { "key" : "6kjr2", "text" : "https://github.com/tyherox/ryeboard/projects/3", "type" : "unstyled", "depth" : 0, "inlineStyleRanges" : [ ], "entityRanges" : [ ], "data" : {  } } ], "entityMap" : {  } } } }, { "id" : 1, "type" : "note", "left" : 450, "top" : 330, "width" : 285, "height" : 270, "data" : { "editorState" : { "blocks" : [ { "key" : "5bqbd", "text" : "2. How do I use it?", "type" : "unstyled", "depth" : 0, "inlineStyleRanges" : [ { "offset" : 0, "length" : 19, "style" : "BOLD" } ], "entityRanges" : [ ], "data" : {  } }, { "key" : "1qq6m", "text" : "Ryeboard is all about drag and drop. Access the widgets on the left-hand side and drag it on to the board! You can also resize widgets with the little arrow on the bottom-right of each widget.", "type" : "unstyled", "depth" : 0, "inlineStyleRanges" : [ ], "entityRanges" : [ ], "data" : {  } }, { "key" : "734ct", "text" : "You can try moving all of us around right now!", "type" : "unstyled", "depth" : 0, "inlineStyleRanges" : [ ], "entityRanges" : [ ], "data" : {  } }, { "key" : "8q084", "text" : "*shift clicking allows multi-selecting!", "type" : "unstyled", "depth" : 0, "inlineStyleRanges" : [ { "offset" : 0, "length" : 39, "style" : "ITALIC" } ], "entityRanges" : [ ], "data" : {  } } ], "entityMap" : {  } } } }, { "id" : 7, "data" : { "image" : "https://images.unsplash.com/photo-1524821695732-717b25a38974?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=08f92fcbaca12ac3d128dbc91f447164&auto=format&fit=crop&w=1800&q=80" }, "left" : 630, "top" : 45, "height" : 270, "width" : 390, "type" : "image" }, { "id" : 6, "type" : "note", "data" : { "editorState" : { "blocks" : [ { "key" : "6md75", "text" : "4. Will this be free?", "type" : "unstyled", "depth" : 0, "inlineStyleRanges" : [ { "offset" : 0, "length" : 21, "style" : "BOLD" } ], "entityRanges" : [ ], "data" : {  } }, { "key" : "3l0p1", "text" : "There will always be a free version, albeit with minor limitations. But a paid version won't come out until after the official launch!", "type" : "unstyled", "depth" : 0, "inlineStyleRanges" : [ ], "entityRanges" : [ ], "data" : {  } }, { "key" : "9qtac", "text" : "*But you need to login for your changes to save!", "type" : "unstyled", "depth" : 0, "inlineStyleRanges" : [ { "offset" : 0, "length" : 48, "style" : "ITALIC" } ], "entityRanges" : [ ], "data" : {  } } ], "entityMap" : {  } } }, "left" : 750, "top" : 615, "width" : 375, "height" : 270 }, { "id" : 0, "type" : "note", "left" : 240, "top" : 60, "width" : 375, "height" : 255, "data" : { "editorState" : { "blocks" : [ { "key" : "2tm63", "text" : "1. What is Ryeboard?", "type" : "unstyled", "depth" : 0, "inlineStyleRanges" : [ { "offset" : 0, "length" : 20, "style" : "BOLD" } ], "entityRanges" : [ ], "data" : {  } }, { "key" : "23grj", "text" : "Ryeboard is a creative workspace where you can: ", "type" : "unstyled", "depth" : 0, "inlineStyleRanges" : [ ], "entityRanges" : [ ], "data" : {  } }, { "key" : "7qd1p", "text" : "- brainstorm and organize your next essay", "type" : "unstyled", "depth" : 0, "inlineStyleRanges" : [ ], "entityRanges" : [ ], "data" : {  } }, { "key" : "47pjt", "text" : "- create a mood board for your design projects ", "type" : "unstyled", "depth" : 0, "inlineStyleRanges" : [ ], "entityRanges" : [ ], "data" : {  } }, { "key" : "7muh5", "text" : "- collect resources for research", "type" : "unstyled", "depth" : 0, "inlineStyleRanges" : [ ], "entityRanges" : [ ], "data" : {  } }, { "key" : "dkavr", "text" : "- and more!", "type" : "unstyled", "depth" : 0, "inlineStyleRanges" : [ ], "entityRanges" : [ ], "data" : {  } }, { "key" : "361if", "text" : "*it only works for desktops at the moment!", "type" : "unstyled", "depth" : 0, "inlineStyleRanges" : [ { "offset" : 0, "length" : 42, "style" : "ITALIC" } ], "entityRanges" : [ ], "data" : {  } } ], "entityMap" : {  } } } } ];

function selection(state = DEFAULT_STATE, action) {

    switch (action.type) {

        case types.BOARD_ADD: {
            let newState = state.slice();
            let id = setId(state);
            newState.push({id, ...action.value});
            return newState;
        }

        case types.BOARD_REMOVE: {
            let newState = state.slice();
            if(Array.isArray(action.value)){
                action.value.forEach(function(selection){
                    newState.splice(newState.findIndex((elem) => elem.id === selection), 1);
                })
            }
            else{
                let pos = newState.findIndex((elem) => elem.id === action.value);
                newState.splice(pos, 1);
            }
            return newState;
        }

        case types.BOARD_MODIFY: {
            let newState = state.slice();
            let pos = state.findIndex((elem) => elem.id === action.value.id);
            let widget = newState[pos];
            newState[pos] = deepChange(action.value, widget);
            return newState;
        }

        case types.BOARD_MULTI_SELECT_WIDGET :
        case types.BOARD_SELECT_WIDGET: {
            if(action.value === null) return state;
            let newState = state.slice();
            let pos = state.findIndex((elem) => elem.id === action.value.id);
            let selectedWidget = newState[pos];
            newState.splice(pos, 1);
            newState.splice(state.length - 1, 0, selectedWidget);
            return newState;
        }

        case types.SET_STATE : {
            if(action.value){
                let newState = action.value.boardLayout;
                return newState;
            }
            else return DEFAULT_STATE;
        }

        default:
            return state;
    }
}

function setId(state){
    let id = 0;

    while(state.findIndex((elem)=> elem.id === id)!==-1){
        if(id === 100) break;
        id++;
        console.log("Incrementing for ID")
    }
    return id;
}

export default selection;
