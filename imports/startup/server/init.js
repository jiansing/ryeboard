
//Set Google config for OAuth Login
let secrets = JSON.parse(Assets.getText('client_secret.json'));

ServiceConfiguration.configurations.upsert({
    service: "google"
}, {
    $set: {
        loginStyle: "popup",
        clientId: secrets.client_id,
        secret: secrets.client_secret
    }
});