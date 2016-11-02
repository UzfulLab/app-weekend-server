var SkyUECountries = [
  "RU-sky", //Russie
  "UA-sky", //Ukraine
  "FR-sky", //France
  "ES-sky", //Espagne
  "SE-sky", //Suede
  "KZ-sky", //Kazakhstan
  "DE-sky", //Allemagne
  "FI-sky", //Finlande
  "NO-sky", //Norvege
  "PL-sky", //Pologne
  "IT-sky", //Italie
  "UK-sky", //Royaume-Uni
  "RO-sky", //Roumanie
  "BY-sky", //Bielorussie
  "GR-sky", //Grece
  "BG-sky", //Bulgarie
  "IS-sky", //Islande
  "HU-sky", //Hongrie
  "PT-sky", //Portugal
  "RS-sky", //Serbie
  "AT-sky", //Autriche
  "CZ-sky", //Republique Tcheque
  "IE-sky", //Irlande
  "LT-sky", //Lituanie
  "LV-sky", //Lettonie
  "HR-sky", //Croatie
  "BA-sky", //Bosnie-Herzegovine
  "SK-sky", //Slovaquie
  "EE-sky", //Estonie
  "DK-sky", //Danemark
  "NL-sky", //Pays-Bas
  "CH-sky", //Suisse
  "MD-sky", //Moldavie
  "BE-sky", //Belgique
  "AL-sky", //Albanie
  "SKG-sky", //Macedoine
  "TR-sky", //Turquie
  "SI-sky", //Slovenie
  "ME-sky", //Montenegro
  "LUX-sky", //Luxembourg
  "AD-sky", //Andorre
  "MLA-sky", //Malte
  "LI-sky", //Liechenstein
  "SX-sky", //Saint-Martin
  "MC-sky", //Monaco
  "VA-sky", //Vatican
  "AM-sky", //Armenie
  "CY-sky", //Chypre
  "AZ-sky", //Azerbaidjan
  "GE-sky" //Georgie
]

var UECountries = {
  "RU-sky": "Russie",
  "UA-sky": "Ukraine",
  "FR-sky": "France",
  "ES-sky": "Espagne",
  "SE-sky": "Suede",
  "KZ-sky": "Kazakhstan",
  "DE-sky": "Allemagne",
  "FI-sky": "Finlande",
  "NO-sky": "Norvege",
  "PL-sky": "Pologne",
  "IT-sky": "Italie",
  "UK-sky": "Royaume-Uni",
  "RO-sky": "Roumanie",
  "BY-sky": "Bielorussie",
  "GR-sky": "Grece",
  "BG-sky": "Bulgarie",
  "IS-sky": "Islande",
  "HU-sky": "Hongrie",
  "PT-sky": "Portugal",
  "RS-sky": "Serbie",
  "AT-sky": "Autriche",
  "CZ-sky": "Republique Tcheque",
  "IE-sky": "Irlande",
  "LT-sky": "Lituanie",
  "LV-sky": "Lettonie",
  "HR-sky": "Croatie",
  "BA-sky": "Bosnie-Herzegovine",
  "SK-sky": "Slovaquie",
  "EE-sky": "Estonie",
  "DK-sky": "Danemark",
  "NL-sky": "Pays-Bas",
  "CH-sky": "Suisse",
  "MD-sky": "Moldavie",
  "BE-sky": "Belgique",
  "AL-sky": "Albanie",
  "SKG-sky": "Macedoine",
  "TR-sky": "Turquie",
  "SI-sky": "Slovenie",
  "ME-sky": "Montenegro",
  "LUX-sky": "Luxembourg",
  "AD-sky": "Andorre",
  "MLA-sky": "Malte",
  "LI-sky": "Liechenstein",
  "SX-sky": "Saint-Martin",
  "MC-sky": "Monaco",
  "VA-sky": "Vatican",
  "AM-sky": "Armenie",
  "CY-sky": "Chypre",
  "AZ-sky": "Azerbaidjan",
  "GE-sky": "Georgie"
}

var apiKey = "uz497893624968959685836267896543"
// var apiKey = "prtl6749387986743898559646983194"
// var apiKey = "uz497893624968959685836267896543"

var http = require('http');
var moment = require('moment');
// var options;
var inbound = [];
var outbound = [];
var momentDate;
var quotes = [];
var jsonString = [];
var counter = 0
// fetching infos about current day to know what date to choose for deals
var today = {dayNumber: moment().day(), hour: moment().hour()};

var Bottleneck = require("bottleneck");
var limiter = new Bottleneck(1, 100);

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/app-weekend')
var Deal = require('../models/dealSchema.js');

var findGoodDate = function(daysToAdd){
  var day = momentDate.date();
  var month = momentDate.month() + 1;
  var year = momentDate.year();
  if (String(day).length == 1) day = '0'+String(day);
  return year+'-'+month+'-'+day;
}

var uzfulLogs = function(){
  console.log("WFT???????")
  console.log(limiter.nbRunning())
  // console.log(Deal.findById(1))
}

var skyScannerApiCall = function(options){
  var req = http.get(options, function(res) {
    // console.log('STATUS: ' + res.statusCode);
    // console.log('HEADERS: ' + JSON.stringify(res.headers));

    // Buffer the body entirely for processing as a whole.
    var bodyChunks = [];
    res.on('data', function(chunk) {
      // You can process streamed parts here...
      bodyChunks.push(chunk);
    }).on('end', function() {
      var body = Buffer.concat(bodyChunks);
      var quotes = JSON.parse(body)["Quotes"];
      // console.log('BODY: ' + body);
      quotes.push(quotes);

      var deal = new Deal();
      deal.id = counter
      deal.price = String(quotes[0].MinPrice)

      deal.save(function(err){
        if (err)
          console.log("ERROR DEAL SAVE ==> "+err)

        console.log("DEAL SAVED ==> "+counter)
      })

      counter++
    })
  });

  req.on('error', function(e) {
    console.log('ERROR: ' + e.message + '\n' + counter);
  });
}

for (var i = 0; i < 3; i++){
  var nextWeek = (today.dayNumber >= (4 + i)) ? true : false;
  var nextWeekToAdd = nextWeek ? 7 : 0;
  var daysToAdd = (4 + i) - moment().day() + nextWeekToAdd;
  momentDate = moment().add(daysToAdd, 'day');
  inbound[i] = findGoodDate(daysToAdd);

  momentDate = momentDate.add(3, 'day');
  outbound[i] = findGoodDate(3);
}
//
// console.log(inbound)
// console.log(outbound)

//First loop for all destinations
for (var i = 0; i < SkyUECountries.length; i++){
  jsonString[i] = '';
  //Second loop for inbound days
  for (var j = 0; j < inbound.length; j++){
    //Third loop for outbound days
    for (var k = 0; k < outbound.length; k++){
      //preparing API call


      var options = {
        hostname: 'partners.api.skyscanner.net',
        path: "/apiservices/browseroutes/v1.0/FR/EUR/fr-FR/PARI-sky/"+SkyUECountries[i]+"/"+inbound[j]+"/"+outbound[k]+"?apiKey="+apiKey,
        // method: 'GET',
        timeout: 2000
      }
      console.log("limiter.nbRunning ", limiter.nbRunning())
      limiter.submit(skyScannerApiCall, options, uzfulLogs);

      // var req = http.request(options, function(res) {
      //   // console.log('STATUS: ' + res.statusCode);
      //   // console.log('HEADERS: ' + JSON.stringify(res.headers));
      //   var jsonString = ''
      //   res.setEncoding('utf8');
      //   res.on('data', function (chunk) {
      //     if (typeof(chunk) !== "undefined"){
      //       if (counter == 1) console.log(jsonString)
      //       if (counter == 1) console.log("\n\n\n\n\n COUNTER == 1 =============\n\n\n\n\n")
      //
      //       if (counter == 10) console.log(jsonString)
      //       if (counter == 10) console.log("\n\n\n\n\n COUNTER == 10 =============\n\n\n\n\n")
      //       jsonString += chunk
      //     }
      //   });
      //   res.on('end', () => {
      //     // console.log('No more data in response. =>'+counter);
      //     // console.log(JSON.parse(jsonString[i])['Quotes'])
      //     // console.log(JSON.parse(jsonString)['Quotes'])
      //     quotes.push(jsonString['Quotes']);
      //     toto.push(counter)
      //     // console.log(counter);
      //     // if (counter == 430) console.log(quotes);
      //     // if (counter == 430) console.log(toto);
      //     counter++
      //     // quotes.push(JSON.parse(jsonString)['Quotes'])
      //   });
      // })
      //
      // req.on('error', (e) => {
      //   counter++
      //   console.log("-------- ERREUR ------")
      //   console.log(`problem with request: ${e.message}`);
      // });
      //
      // req.write(toto)
      // req.end()
    }
  }

  //Second loop for departures day
  //Verification to know what day it is and if travel needs to be on next week
}
