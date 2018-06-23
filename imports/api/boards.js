import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Boards = new Mongo.Collection('boards');

/*
 * MongoDB boards API. Used to save and modify board related data
 */

Meteor.methods({

    /**
     * Boards Update
     *
     * Updates board state with given state
     *
     * @param {JSON} state = a JSON object that represent a board state
     */
    'boards.update'(state) {

        // Extract current for save. Ignore past / fast version of boardlayout state as it is used only in undoing actions.
        let savableState = {
            boardLayout: state.undoable.present.boardLayout,
            settings: state.settings
        }

        // Make sure the user is logged in before inserting a task
        if (! this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        let doesExist = Boards.findOne({owner: this.userId});

        //Check if user has prior data. If not create a new one.
        if(!doesExist){
            //Creating new board data
            Boards.insert({
                state: savableState,
                createdAt: new Date(),
                owner: this.userId,
                username: Meteor.users.findOne(this.userId).username,
            });
        }
        else{
            //Updating existing board data
            Boards.update({owner: this.userId}, {
                $set: {state: savableState}
            });
        }


    },

    /**
     * Boards Find
     *
     * Finds the board data relate to the current user
     *
     */
    async 'boards.find'() {
        // Make sure the user is logged in before inserting a task
        if (! this.userId) {
            throw new Meteor.Error('not-authorized');
        }
        return await Boards.findOne({owner: this.userId});
    }
});