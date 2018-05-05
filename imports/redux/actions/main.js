/**
 * Created by JohnBae on 7/1/17.
 */

import * as types from '../constants/actionTypes';

//***** Board Redux Actions *****//

export const addToBoard = (object) => {

    return {
        type: types.BOARD_ADD,
        value: object
    }
};

export const removeFromBoard = (path) => {

    return {
        type: types.BOARD_REMOVE,
        value: path
    }
};

export const modifyBoard = (value, preventSync) => {

    return {
        type: types.BOARD_MODIFY,
        value: value,
        preventSync: preventSync
    }
};

export const selectWidgetFromBoard = (id, data) => {

    return {
        type: types.BOARD_SELECT_WIDGET,
        value: {id, data}
    }
};

export const deselectWidgetFromBoard = () => {

    return {
        type: types.BOARD_DESELECT_WIDGET,
    }
};

//***** Settings Redux Actions *****//

export const addSettingsParam = (object) => {

    return {
        type: types.SETTINGS_ADD,
        value: object
    }
};

export const removeSettingsParam = (path) => {

    return {
        type: types.SETTINGS_REMOVE,
        value: path
    }
};

export const modifySettingsParam = (value) => {

    return {
        type: types.SETTINGS_MODIFY,
        value: value
    }
};

export const setMutable = () => {

    return {
        type: 'SET_MUTABLE'
    }
};

export const setState = (state) => {

    return {
        type: 'SET_STATE',
        value: state
    }
};
