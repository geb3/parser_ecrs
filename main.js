'use strict';

const {google} = require('googleapis');
const keys = require("./parse xml-xlsx/keys.json");
const cheerio = require("cheerio");
const axios = require("axios");

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

var parseArray = [];

async function gsrun(cl) {
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
        let getHTML = async (url) => {
            let {data} = await axios.get(url);
            return cheerio.load(data);
        };
        const $ = await getHTML("https://www.ecrs.ru/catalogue/fiskalnye-registratory/evotor-power-fn36.html");
        let tempPrice = $('div[class=product-page__price]').html();
        let prices = tempPrice.replace(/[^0-9]/g, '');
        console.log(prices);
        
    }
    async function parses() {
        let getHTML = async (url) => {
            let {data} = await axios.get(url);
            return cheerio.load(data);
        };
        const $ = await getHTML("https://www.ecrs.ru/catalogue/fiskalnye-registratory/evotor-power-1.html");
        let tempPrice = $('div[class=product-page__price]').html();
        let prices = tempPrice.replace(/[^0-9]/g, '');
        console.log(prices);
        
    }
    // for (let indexArray = 0; typeof parseArray[indexArray] != "undefined"; indexArray++) {
        
    // }
    parse()
    parses()
}
