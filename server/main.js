import { Meteor } from 'meteor/meteor';
import '../imports/api/boards.js';
import '../imports/api/s3Storage.js';
import '/imports/startup/server/init';

Meteor.startup(() => {
    WebApp.rawConnectHandlers.use(function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        return next();
    });
});
