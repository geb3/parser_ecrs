'use strict';

const {google} = require('googleapis');
const keys = require("./parse xml-xlsx/keys.json");

const client = new google.auth.JWT(
    keys.client_email, 
    null, 
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets'] 
);

client.authorize(function(err) {
    if (err) {
        console.log(err);
        return;
    }
    else {
        console.log(`There is no problem with the client`);
        gsrun(client);
    }
});

async function gsrun(cl) {
    const gsapi = google.sheets({version: "v4",auth: cl});
    const readOptions = {
        spreadsheetId: "1GJsO3s4xrxhgKmc8pHXTtJAIBRzGBLG6Wu28NTfITHo",
        range: "Лист1!A2:A9999",
    };
    let data = await gsapi.spreadsheets.values.get(readOptions);
    let dataArray = data.data.values;
    
}
