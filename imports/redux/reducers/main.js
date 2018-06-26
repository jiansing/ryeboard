/**
 * Created by JohnBae on 7/1/17.
 */

import boardLayout from './boardLayout';
import boardLogic from './boardLogic';
import settings from './settings';
import { combineReducers } from 'redux'
import undoable from 'redux-undo';

//Mix with undoable to enable undo redo functionality
export default combineReducers({
    undoable: undoable(combineReducers({
        boardLayout,
        boardLogic,
    }), {
        limit: 15,
        filter: function filterActions(action, currentState, previousHistory) {
            //This is to allow multiple actions to be interpreted as a single undoable action
            return action.type === 'SET_MUTABLE';
        }
    }),
    settings
})