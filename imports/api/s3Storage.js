let rawCredentials = JSON.parse(Assets.getText("AWSConfig.json"));

let S3 = require('aws-sdk/clients/s3');

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
        return Meteor.userId() + "/" + Date.now() + "-" + file.name;
    }
});