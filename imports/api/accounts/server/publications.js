/**
 * Created by JohnBae on 4/29/17.
 */

Meteor.publish('userData', function () {

    const selector = {
        _id: this.userId
    };

    const options = {
        fields: { 'services.google.name': 1, 'services.google.email': 1}
    };

    return Meteor.users.find(selector, options);
});