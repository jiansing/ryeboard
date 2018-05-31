import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Boards = new Mongo.Collection('boards');

Meteor.methods({
    'boards.update'(state) {

        let parsedState = {
            boardLayout: state.undoable.present.boardLayout,
            settings: state.settings
        }

        // Make sure the user is logged in before inserting a task
        if (! this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        let doesExist = Boards.findOne({owner: this.userId});

        if(!doesExist){
            Boards.insert({
                state: parsedState,
                createdAt: new Date(),
                owner: this.userId,
                username: Meteor.users.findOne(this.userId).username,
            });
        }
        else{
            Boards.update({owner: this.userId}, {
                $set: {state: parsedState}
            });
        }


    },

    async 'boards.find'() {
        // Make sure the user is logged in before inserting a task
        if (! this.userId) {
            throw new Meteor.Error('not-authorized');
        }
        return await Boards.findOne({owner: this.userId});
    }
});