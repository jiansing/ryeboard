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

export const setSelectedWidgetData = (data) => {

    return {
        type: types.BOARD_SET_SELECTED_WIDGET_DATA,
        value: data
    }
};

export const selectWidgetFromBoard = (id, data) => {

    return {
        type: types.BOARD_SELECT_WIDGET,
        value: {id, data}
    }
};

export const multiSelectWidgetFromBoard = (id, data) => {

    return {
        type: types.BOARD_MULTI_SELECT_WIDGET,
        value: {id}
    }
};

export const deselectWidgetFromBoard = (id) => {

    return {
        type: types.BOARD_DESELECT_WIDGET,
        value: id
    }
};

export const deselectAllWidgetFromBoard = () => {

    return {
        type: types.BOARD_DESELECT_ALL_WIDGET,
    }
};

export const dragWidgetOnBoard = (id) => {

    return {
        type: types.BOARD_DRAG_WIDGET,
        value: id
    }
};

export const multiDragWidgetOnBoard = (id) => {

    return {
        type: types.BOARD_MULTI_DRAG_WIDGET,
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

//***** Other Redux Actions *****//

//Tells undoable that a state is not undoable
export const setMutable = () => {
    return {
        type: 'SET_MUTABLE'
    }
};

//State override (when initializing boards)
export const setState = (state) => {

    return {
        type: 'SET_STATE',
        value: state
    }
};
