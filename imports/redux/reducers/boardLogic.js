/**
 * Created by JohnBae on 7/1/17.
 */

import * as types from '../constants/actionTypes';
import deepChange from 'updeep';

const DEFAULT_STATE = {
    selected: null,
};

function selection(state = DEFAULT_STATE, action) {

    switch (action.type) {

        case types.BOARD_SELECT_WIDGET: {
            let newState = JSON.parse(JSON.stringify(state));
            newState.selected = action.value;
            return newState;
        }

        case types.BOARD_DESELECT_WIDGET: {
            let newState = JSON.parse(JSON.stringify(state));
            newState.selected = null;
            return newState;
        }

        default:
            return state;
    }
}

export default selection;
