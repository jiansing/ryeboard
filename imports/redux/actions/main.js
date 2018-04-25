/**
 * Created by JohnBae on 7/1/17.
 */

import * as types from '../constants/actionTypes';

//***** Profile Redux Actions *****//

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

export const modifyBoard = (value) => {

    return {
        type: types.BOARD_MODIFY,
        value: value
    }
};

export const selectWidgetFromBoard = (id) => {

    return {
        type: types.BOARD_SELECT_WIDGET,
        value: id
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

