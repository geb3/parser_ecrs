'use strict';

const timeStart = new Date();
console.log(`${timeStart.getHours()}:${timeStart.getMinutes()}:${timeStart.getSeconds()} Wait..`);

const fs = require('fs');
const xml2js = require('xml2js');
const {google} = require('googleapis');
const keys = require("./keys.json");

let arrayXml = [];

const files = fs.readdirSync('input/');
let parser = new xml2js.Parser();
fs.readFile('input/' + String(files), function(err, data) {
    parser.parseString(data, function (err, result) {
        let num = 1;
        for (let indexItems = 0; typeof result["КоммерческаяИнформация"]["Каталог"][0]["Товары"][0]["Товар"][indexItems] != "undefined"; indexItems++) {
            let id = String(result["КоммерческаяИнформация"]["Каталог"][0]["Товары"][0]["Товар"][indexItems]["Ид"]);;
            let article = String(result["КоммерческаяИнформация"]["Каталог"][0]["Товары"][0]["Товар"][indexItems]["Артикул"]);;
            let name = String(result["КоммерческаяИнформация"]["Каталог"][0]["Товары"][0]["Товар"][indexItems]["Наименование"]);;
            // console.log(jsonObj);
            arrayXml.push([id, article, name]);
            num+=1;
        }
        console.log("Completed in " + (new Date().getSeconds() - timeStart.getSeconds()) + " second");
    });
});

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
    // read
    // const readOptions = {
    //     spreadsheetId: "1GJsO3s4xrxhgKmc8pHXTtJAIBRzGBLG6Wu28NTfITHo",
    //     range: "Лист1!B1:D2",
    // };
    // let data = await gsapi.spreadsheets.values.get(readOptions);
    // let dataArray = data.data.values;
    // console.log(dataArray);
    const updateOptions = {
        spreadsheetId: "1GJsO3s4xrxhgKmc8pHXTtJAIBRzGBLG6Wu28NTfITHo",
        range: "Лист1!B2",
        valueInputOption: "USER_ENTERED",
        resource: {values: arrayXml},
    };
    let data = await gsapi.spreadsheets.values.update(updateOptions);
    let dataArray = data.data.values;
}

