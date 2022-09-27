'use strict';

const {google} = require('googleapis');
const keys = require("./parse xml-xlsx/keys.json");
const cheerio = require("cheerio");
const axios = require("axios");

function getDataTable(dataResultParse) {
    client.authorize(function(err) {
        if (err) {
            console.log(err);
            return;
        }
        else {
            console.log(`There is no problem with the client`);
            gtUpdate(client);
        }
    });
    
    async function gtUpdate(cl) {
        const gsapi = google.sheets({version: "v4",auth: cl});
        const updateOptions = {
            spreadsheetId: "1GJsO3s4xrxhgKmc8pHXTtJAIBRzGBLG6Wu28NTfITHo",
            range: "Лист1!E2:E9999",
            valueInputOption: "USER_ENTERED",
            resource: {values: dataResultParse},
        };
        let data = await gsapi.spreadsheets.values.update(updateOptions);
        let dataArray = data.data.values;
    }
}

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
        gtRead(client);
    }
});
var dataResultParse = [];
var parseArray = [];
async function gtRead(cl) {
    const gsapi = google.sheets({version: "v4",auth: cl});
    const readOptions = {
        spreadsheetId: "1GJsO3s4xrxhgKmc8pHXTtJAIBRzGBLG6Wu28NTfITHo",
        range: "Лист1!A2:A9999",
    };
    let data = await gsapi.spreadsheets.values.get(readOptions);
    let dataArray = data.data.values;
    
    dataArray.forEach(function(item) {
        if (item != "") parseArray.push(String(item));
      });
    console.log(parseArray);
    
    async function parse() {
        let getHTML = async (urlTemp) => {
            let {data} = await axios.get(urlTemp);
            return cheerio.load(data);
        };
        for (let indexArray = 0; typeof parseArray[indexArray] != "undefined"; indexArray++) {
            if (parseArray[indexArray].slice(0, 28) == adr_1) {
                const $ = await getHTML(parseArray[indexArray]);
                let dataParse = $('.autocalc-product-price').text();
                dataParse = dataParse.split('.')[0];
                dataResultParse.push([String(dataParse)]);
                
            }
            else {
                dataResultParse.push(["-"]);
            }
        }
            // console.log("\n\n--------------\n\n");
            // const arrayText = format.split(";");
            // // console.log(arrayText);
            // // arrayText.filter(Boolean);
            // // console.log(arrayText.filter(Boolean));
            // arrayText.forEach(function(item) {
            //     if (item == "font-size") console.log(item)
            // })
        console.log(dataResultParse);
        getDataTable(dataResultParse);
    }
    
        // let prices = tempPrice.replace(/[^0-9]/g, '');
    const adr_1 = "https://www.online-kassy.ru/";
    
    parse();
    
}


