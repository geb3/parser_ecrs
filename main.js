'use strict';

var {google} = require('googleapis');
var keys = require("./parse xml-xlsx/keys.json");
var cheerio = require("cheerio");
var axios = require("axios");

var client = new google.auth.JWT(
    keys.client_email, 
    null, 
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets'] 
);

function timeOut() {
    client.authorize(function(err) {
        if (err) {
            console.log(err);
            return;
        }
        else {
            console.log(`There is no problem with the client receiving 'TimeOut' ✅`);
            gtReadTimeOut(client);
        }
    });
    async function gtReadTimeOut(cl) {
        const gsapi = google.sheets({version: "v4",auth: cl});
        const readOptions = {
            spreadsheetId: "1GJsO3s4xrxhgKmc8pHXTtJAIBRzGBLG6Wu28NTfITHo",
            range: "console!A2:C2",
        };
        let data = await gsapi.spreadsheets.values.get(readOptions);
        let dataTimeOut = data.data.values;
        let hours = 0;
        let minutes = 0;
        let seconds = 0;
        for (let indexDataTimeOut = 0; indexDataTimeOut < 4; indexDataTimeOut++) {
            if (indexDataTimeOut == 0) hours = Number(dataTimeOut[0][indexDataTimeOut]);
            if (indexDataTimeOut == 1) minutes = Number(dataTimeOut[0][indexDataTimeOut]);
            if (indexDataTimeOut == 2) seconds = Number(dataTimeOut[0][indexDataTimeOut]);
            if (indexDataTimeOut == 3) {
                console.log(`TimeOut ${hours} hours ${minutes} minutes ${seconds} seconds\n`);
                startParser((hours * 3600) + (minutes * 60) + (seconds));
            }
        }
    }
}

function startParser(delay) {
    var logs = [];
    setInterval(() => {
        // обновление логов
        function getDataTableLogs(log) {
            client.authorize(function(err) {
                if (err) {
                    console.log(err);
                    return;
                }
                else {
                    gtUpdateLogs(client);
                }
            });
            async function gtUpdateLogs(cl) {
                const date = new Date();
                const logs = [];
                logs.push([String(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getDay()}.${date.getMonth()}.${date.getFullYear()} - ${log}`)]);
                const gsapi = google.sheets({version: "v4",auth: cl});
                const updateOptions = {
                    spreadsheetId: "1GJsO3s4xrxhgKmc8pHXTtJAIBRzGBLG6Wu28NTfITHo",
                    range: "console!E2:E9999",
                    valueInputOption: "USER_ENTERED",
                    resource: {values: logs},
                };
                let data = await gsapi.spreadsheets.values.update(updateOptions);
                let dataArray = data.data.values;
                console.log("------------------------------------------\nLogs are recorded ✅\n");
            }
        }
        // обновление таблицы
        function getDataTable(dataResultParse) {
            client.authorize(function(err) {
                if (err) {
                    console.log(err);
                    return;
                }
                else {
                    console.log(`There is no problem with the client ✅`);
                    gtUpdate(client);
                }
            });
            async function gtUpdate(cl) {
                const gsapi = google.sheets({version: "v4",auth: cl});
                const updateOptions = {
                    spreadsheetId: "1GJsO3s4xrxhgKmc8pHXTtJAIBRzGBLG6Wu28NTfITHo",
                    range: "data!E2:E9999",
                    valueInputOption: "USER_ENTERED",
                    resource: {values: dataResultParse},
                };
                let data = await gsapi.spreadsheets.values.update(updateOptions);
                let dataArray = data.data.values;
                console.log("Table data updated ✅");
                getDataTableLogs("Table data updated ✅");
            }
        }

        client.authorize(function(err) {
            if (err) {
                console.log(err);
                return;
            }
            else {
                console.log(`There is no problem with the client URL ✅`);
                gtRead(client);
            }
        });

        var dataResultParse = [];
        var parseArray = [];

        async function gtRead(cl) {
            const gsapi = google.sheets({version: "v4",auth: cl});
            const readOptions = {
                spreadsheetId: "1GJsO3s4xrxhgKmc8pHXTtJAIBRzGBLG6Wu28NTfITHo",
                range: "data!A2:A9999",
            };

            let data = await gsapi.spreadsheets.values.get(readOptions);
            let dataArray = data.data.values;

            dataArray.forEach(function(item) {
                if (item != "") parseArray.push(String(item));
            });
            // console.log(parseArray);

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
                        dataResultParse.push(["0"]);
                    }
                }
                // console.log(dataResultParse);
                console.log("Data received ✅");
                getDataTable(dataResultParse, logs);
            }
            const adr_1 = "https://www.online-kassy.ru/";
            parse();
        }
    }, delay * 1000);
}
timeOut()