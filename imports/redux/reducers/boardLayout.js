/**
 * Created by JohnBae on 7/1/17.
 */

import * as types from '../constants/actionTypes';
import deepChange from 'updeep';

const DEFAULT_STATE = [];

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
            let pos = state.findIndex((elem) => elem.id === action.value);
            newState.splice(pos, 1);
            return newState;
        }

        case types.BOARD_MODIFY: {
            let newState = state.slice();
            let pos = state.findIndex((elem) => elem.id === action.value.id);
            let widget = newState[pos];
            newState[pos] = deepChange(action.value, widget);
            return newState;
        }

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
