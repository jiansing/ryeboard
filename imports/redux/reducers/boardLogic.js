/**
 * Created by JohnBae on 7/1/17.
 */

import * as types from '../constants/actionTypes';

const DEFAULT_STATE = {
    selected: null,
    title: null,
};

function selection(state = DEFAULT_STATE, action) {

    switch (action.type) {

        case types.BOARD_SELECT_WIDGET: {
            let newState = JSON.parse(JSON.stringify(state));
            newState.selected = action.value;
            return newState;
        }

        case types.BOARD_DESELECT_WIDGET: {
            console.log('deselecting');
            let newState = JSON.parse(JSON.stringify(state));
            newState.selected = null;
            return newState;
        }

        case types.BOARD_REMOVE: {
            let newState = JSON.parse(JSON.stringify(state));
            if(action.value === state.selected.id) newState.selected = null;
            else {
                return state;
            }
            return newState;
        }

        case types.SET_STATE : {
            if(action.value){
                let newState = action.value.boardLogic;
                return newState;
            }
            else return DEFAULT_STATE;
        }

        default:
            return state;
    }
}

export default selection;
