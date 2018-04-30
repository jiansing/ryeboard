/**
 * Created by JohnBae on 7/1/17.
 */

import boardLayout from './boardLayout';
import boardLogic from './boardLogic';
import settings from './settings';
import { combineReducers } from 'redux'
import undoable from 'redux-undo';

export default combineReducers({
    undoable: undoable(combineReducers({
        boardLayout,
        boardLogic,
        settings
    }), {
        limit: 15,
        filter: function filterActions(action, currentState, previousHistory) {
            console.log(action.type, 'MUTABLE');
            return action.type === 'MUTABLE';
        }
    })
})