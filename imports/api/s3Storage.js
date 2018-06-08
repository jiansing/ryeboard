let rawCredentials = JSON.parse(Assets.getText("AWSConfig.json"));

//Slingshot S3 Upload

let credentials = {
    accessKeyId: rawCredentials.accessKeyId,
    secretAccessKey: rawCredentials.secretAccessKey,
    region: rawCredentials.region
}

Slingshot.fileRestrictions("userImageUploads", {
    allowedFileTypes: ["image/png", "image/jpeg"],
    maxSize: 25 * 1024 * 1024 // 10 MB (use null for unlimited).
});

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
        console.log("FILE:", file);
        let id = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
        return 'userData/' + Meteor.userId() + "/" + id;
    }
});

//Raw S3 API

let S3 = require('aws-sdk/clients/s3');

let s3 = new S3({
    apiVersion: '2006-03-01',
    region: credentials.region,
    credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey
    }
});

Meteor.methods({
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
                            console.log('deleting:', "https://ryeboard.s3.ap-northeast-2.amazonaws.com/ryeboard/userData/" + key);
                        }
                    });
                });
            });

        }
    }
});