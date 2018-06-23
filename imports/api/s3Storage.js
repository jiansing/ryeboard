/*
 * Amazon S3 related API. Used to upload, download, and maintain files on S3 servers.
 */

//Read private data for setting up AWS
let rawCredentials = JSON.parse(Assets.getText("AWSConfig.json"));

//Credentials for AWS
let credentials = {
    accessKeyId: rawCredentials.accessKeyId,
    secretAccessKey: rawCredentials.secretAccessKey,
    region: rawCredentials.region
}

//Restrict type of files that can be uploaded
Slingshot.fileRestrictions("userImageUploads", {
    allowedFileTypes: ["image/png", "image/jpeg"], // Limit file upload type to png / jpeg files
    maxSize: 25 * 1024 * 1024 //Limit file upload size to 10MB.
});

/**
 * Function to upload user images. Uses a library called slingshot.
 *
 * Creates an object that can be used to send user images to S3. See image widget main file for examples.
 *
 * Only accepts valid files and returns a download URL
 */
Slingshot.createDirective("userImageUploads", Slingshot.S3Storage, {
    cdn: 'https://s3.ap-northeast-2.amazonaws.com/ryeboard/',
    bucket: "ryeboard",
    acl: "public-read",
    AWSAccessKeyId: credentials.accessKeyId,
    AWSSecretAccessKey: credentials.secretAccessKey,
    region: credentials.region,
    authorize: function () {
        if (!this.userId) {
            let message = "Please login before posting files";
            throw new Meteor.Error("Login Required", message);
        }
        return true;
    },
    key: function (file) {
        //Set unique id before upload
        let id = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
        return 'userData/' + Meteor.userId() + "/" + id;
    }
});

//Raw S3 API
let S3 = require('aws-sdk/clients/s3');

//Create correct credentials to start using raw S3 API
let s3 = new S3({
    apiVersion: '2006-03-01',
    region: credentials.region,
    credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey
    }
});

Meteor.methods({

    /**
     * Boards Initialize
     *
     * Cleans up S3 storage of images not being used.
     */
    'boards.initialize'(){
        if (this.userId) {

            Meteor.call('boards.find', (error, result) => {
                if(error || typeof result === 'undefined') return '';

                let usedImages = [];

                result.state.boardLayout.forEach(function(elem){
                    if(elem.data && elem.data.image && elem.data.image.indexOf('https://s3.ap-northeast-2.amazonaws.com/ryeboard/')!==-1) {
                        usedImages.push(elem.data.image);
                    }
                });

                s3.listObjectsV2({Bucket: 'ryeboard', Delimiter: '/', Prefix: 'userData/' + Meteor.userId() + '/'}, function(err, object){

                    object.Contents.forEach(function(elem){

                        let key = elem['Key'];

                        let queDelete = usedImages.findIndex((elem) =>{
                            return elem === 'https://s3.ap-northeast-2.amazonaws.com/ryeboard/' + key;
                        });

                        if(queDelete === -1) {
                            s3.deleteObject({Bucket: 'ryeboard', Key: key}, function(err, data) {
                                if (err) console.log(err, err.stack); // an error occurred
                                else     console.log(data);           // successful response
                            });
                        }
                    });
                });

            });

        }
    }
});