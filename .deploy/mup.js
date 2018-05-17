module.exports = {
    servers: {
        one: {
            // TODO: set host address, username, and authentication method
            host: '13.125.66.253',
            username: 'ubuntu',
            pem: "../../ryestory.pem"
            // password: 'server-password'
            // or neither for authenticate from ssh-agent
        }
    },

    app: {
        // TODO: change app name and path
        name: 'ryeboard',
        path: '../',

        servers: {
            one: {},
        },

        buildOptions: {
            serverOnly: true,
        },

        env: {
            // TODO: Change to your app's url
            // If you are using ssl, it needs to start with https://
            ROOT_URL: 'http://www.ryeboard.com'
        },

        docker: {
            // change to 'abernix/meteord:base' if your app is using Meteor 1.4 - 1.5
            image: 'abernix/meteord:node-8.4.0-base',
        },

        // Show progress bar while uploading bundle to server
        // You might need to disable it on CI servers
        enableUploadProgressBar: true
    },

    mongo: {
        version: '3.4.1',
        servers: {
            one: {}
        }
    },
};
