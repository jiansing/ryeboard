/**
 * Created by JohnBae on 7/1/17.
 */

import board from './board';
import settings from './settings';
import { combineReducers } from 'redux'

export default combineReducers({
    board,
    settings
})
