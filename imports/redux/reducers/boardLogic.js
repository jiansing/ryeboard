/**
 * Created by JohnBae on 7/1/17.
 */

import * as types from '../constants/actionTypes';

const DEFAULT_STATE = {
    selected: null,
    dragging: null
};

function selection(state = DEFAULT_STATE, action) {

    switch (action.type) {

        case types.BOARD_SELECT_WIDGET: {
            let newState = JSON.parse(JSON.stringify(state));
            newState.selected = action.value;
            return newState;
        }

        case types.BOARD_MULTI_SELECT_WIDGET: {
            let newState = JSON.parse(JSON.stringify(state));

            if(Array.isArray(newState.selected)){
                newState.selected.push(action.value);
            }
            else if(newState.selected){
                newState.selected = [newState.selected];
                newState.selected.push(action.value);
            }
            else{
                newState.selected = [action.value];
            }
            console.log(newState);
            return newState;
        }

        case types.BOARD_DESELECT_ALL_WIDGET: {
            let newState = JSON.parse(JSON.stringify(state));
            newState.selected = null;
            return newState;
        }

        case types.BOARD_DESELECT_WIDGET: {
            let newState = JSON.parse(JSON.stringify(state));
            if(Array.isArray(newState.selected)){
                let deselectedIndex = newState.selected.findIndex((element)=> element.id === action.value);
                newState.selected.splice(deselectedIndex, 1);
                if(newState.selected.length === 0) newState.selected = null;
            }
            else{
                newState.selected = null;
            }

            return newState;
        }

        case types.BOARD_DRAG_WIDGET: {
            let newState = JSON.parse(JSON.stringify(state));
            newState.dragging = action.value;

            return newState;
        }

        case types.BOARD_MULTI_DRAG_WIDGET: {
            let newState = JSON.parse(JSON.stringify(state));
            newState.dragging = action.value;
            return newState;
        }

        case types.BOARD_REMOVE: {
            let newState = JSON.parse(JSON.stringify(state));
            newState.selected = null;
            return newState;
        }

        default:
            return state;
    }
}

export default selection;
