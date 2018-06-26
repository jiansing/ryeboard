/**
 * Created by JohnBae on 7/1/17.
 */

import * as types from '../constants/actionTypes';
import deepChange from 'updeep';

/**
 * Settings stuff
 */

const DEFAULT_STATE = {
    loggedIn: false,
    title: 'Welcome to Ryeboard!',
    zoom: {value: 1}
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
            let newState = deepChange(action.value, state);
            return newState;
        }

        case types.SET_STATE : {
            if(action.value){
                let newState = action.value.settings;
                return newState;
            }
            else return DEFAULT_STATE;
        }

        default:
            return state;
    }
}

export default selection;
