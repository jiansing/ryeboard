/**
 * Created by JohnBae on 7/1/17.
 */

import * as types from '../constants/actionTypes';

/**
 * For board data that does not need to be saved.
 */

const DEFAULT_STATE = {
    selected: null,
    data: null,
    dragging: null,
};

function selection(state = DEFAULT_STATE, action) {

    switch (action.type) {

        //Data regarding the current selected widget. Used when sending data to menu
        case types.BOARD_SET_SELECTED_WIDGET_DATA: {
            let newState = Object.assign(state);
            newState.data = action.value;
            return newState;
        }

        //Set the current selected widget with menu data
        case types.BOARD_SELECT_WIDGET: {
            let newState = Object.assign(state);
            newState.selected = action.value;
            return newState;
        }


        case types.BOARD_MULTI_SELECT_WIDGET: {
            let newState = Object.assign(state);

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
            return newState;
        }

        case types.BOARD_DESELECT_ALL_WIDGET: {
            let newState = Object.assign(state);
            newState.selected = null;
            newState.data = null;
            return newState;
        }

        case types.BOARD_DESELECT_WIDGET: {
            let newState = Object.assign(state);
            if(Array.isArray(newState.selected)){
                let deselectedIndex = newState.selected.findIndex((element)=> element.id === action.value);
                newState.selected.splice(deselectedIndex, 1);
                if(newState.selected.length === 0) {
                    newState.selected = null;
                    newState.data = null;
                }
            }
            else{
                newState.selected = null;
                newState.data = null;
            }

            return newState;
        }

        case types.BOARD_DRAG_WIDGET: {
            let newState = Object.assign(state);
            newState.dragging = action.value;

            return newState;
        }

        case types.BOARD_MULTI_DRAG_WIDGET: {
            let newState = Object.assign(state);
            newState.dragging = action.value;
            return newState;
        }

        case types.BOARD_REMOVE: {
            let newState = Object.assign(state);
            newState.selected = null;
            newState.data = null;
            return newState;
        }

        default:
            return state;
    }
}

export default selection;
