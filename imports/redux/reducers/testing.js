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

        case types.TESTING_MODIFY: {
            return deepChange(action.value, state);
        }

        case types.TESTING_ADD: {
            let newState = JSON.parse(JSON.stringify(state));
            newState.game[action.key] = action.obj;
            return newState;
        }

        case types.TESTING_REMOVE: {
            let newState = JSON.parse(JSON.stringify(state));
            newState.game[action.path] = action.data;
            console.log("ACTION CHECK", action, newState);
            return newState;
        }

        default:
            return state;
    }
}

export default selection;
