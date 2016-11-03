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
var debug = require('debug')('worker');
var schedule = require('node-schedule');


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

var toto = "pouet";


var dummyFunc = function(param) {
  debug("toto ", param)
}

var scheduleRefreshDeals = function(){
  j = schedule.scheduleJob('* * * * *', dummyFunc);
  // j = schedule.scheduleJob('* * * * *', refreshDeals).bind(null, toto);
}()

toto = "pouet pouet"

debug("toto ", toto)

var reqDealData = function(options, cb){
  var req = http.get(options, function(res) {
    // debug('STATUS: ' + res.statusCode);
    // debug('HEADERS: ' + JSON.stringify(res.headers));

    // Buffer the body entirely for processing as a whole.
    var bodyChunks = "";
    res.on('data', function(chunk) {
      // You can process streamed parts here...
      bodyChunks += chunk.toString('utf-8');
    }).on('end', function() {
      // var body = Buffer.concat(bodyChunks);
      var body = bodyChunks
      // debug(body)
      var currentQuotes = JSON.parse(body)["Quotes"];
      // debug(body)
      // debug('BODY: ' + body);
      quotes.push(currentQuotes);

      var deal = new Deal();
      deal.id = counter
      deal.price = String(quotes[0].MinPrice)

      deal.save(function(err){
        if (err)
          debug("ERROR DEAL SAVE ==> "+err)

        debug("DEAL SAVED ==> "+counter+'\n\n\n\n')
        counter++
        debug('RES.ON.END');
        cb()
      })
    })
  });
  req.on('error', function(e) {
    debug('ERROR: ' + e.message + '\n' + counter);
    debug('FUNCTION ERROR');
    cb()
  });
}

var refreshDeals = function(){

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
  debug(inbound)
  debug(outbound)

  //First loop for all destinations
  for (var i = 0; i < SkyUECountries.length; i++){
  // for (var i = 0; i < 1; i++){
    jsonString[i] = '';
    //Second loop for inbound days
    for (var j = 0; j < inbound.length; j++){
    // for (var j = 0; j < 1; j++){
      //Third loop for outbound days
      for (var k = 0; k < outbound.length; k++){
      // for (var k = 0; k < 2; k++){
        //preparing API call
        var options = {
          hostname: 'partners.api.skyscanner.net',
          path: "/apiservices/browseroutes/v1.0/FR/EUR/fr-FR/PARI-sky/"+SkyUECountries[i]+"/"+inbound[j]+"/"+outbound[k]+"?apiKey="+apiKey,
          // method: 'GET',
          timeout: 2000
        }
        // debug("limiter.nbRunning ", limiter.nbRunning())
        var l = limiter.submit(reqDealData, options, function(){
          debug("reqDealData limited callback")
        })
        // var l = limiter.submit(dummyFunc, options, function(){
        //   debug("reqDealData limited callback")
        // })

        debug('submitted to limiter, has strategy been executed ? ', l);
      }
    }
    //Second loop for departures day
    //Verification to know what day it is and if travel needs to be on next week
  }
  limiter.on('empty', function () {
    debug("limiter has launched all its queued tasks")
  })
}
