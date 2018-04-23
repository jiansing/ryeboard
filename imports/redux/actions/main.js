/**
 * Created by JohnBae on 7/1/17.
 */

import * as types from '../constants/actionTypes';

//***** Profile Redux Actions *****//

export const addProfileCreator = (object) => {

    return {
        type: types.PROFILE_CREATOR_ADD,
        value: object
    }
};

export const removeProfileCreator = (path) => {

    return {
        type: types.PROFILE_CREATOR_REMOVE,
        value: path
    }
};

export const modifyProfileCreator = (value) => {

    return {
        type: types.PROFILE_CREATOR_MODIFY,
        value: value
    }
};

//***** Testing Redux Actions *****//

export const addTestParam = (object) => {

    return {
        type: types.TESTING_ADD,
        value: object
    }
};

export const removeTestParam = (path) => {

    return {
        type: types.TESTING_REMOVE,
        value: path
    }
};

export const modifyTestParam = (value) => {

    return {
        type: types.TESTING_MODIFY,
        value: value
    }
};

