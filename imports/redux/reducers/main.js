/**
 * Created by JohnBae on 7/1/17.
 */

import boardLayout from './boardLayout';
import boardLogic from './boardLogic';
import settings from './settings';
import { combineReducers } from 'redux'

export default combineReducers({
    boardLayout,
    boardLogic,
    settings
})
