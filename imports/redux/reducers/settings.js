/**
 * Created by JohnBae on 7/1/17.
 */

import * as types from '../constants/actionTypes';
import deepChange from 'updeep';

const DEFAULT_STATE = {
    loggedIn: false,
};

function selection(state = DEFAULT_STATE, action) {

    switch (action.type) {

        case types.SETTINGS_ADD: {
            let newState = JSON.parse(JSON.stringify(state));
            newState[action.value.key] = action.value.obj;
            return newState;
    }

        case types.SETTINGS_REMOVE: {
            let newState = JSON.parse(JSON.stringify(state));
            delete newState[action.value];
            return newState;
        }

        case types.SETTINGS_MODIFY: {
            return deepChange(action.value, state);
        }

        default:
            return state;
    }
}

export default selection;
