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

var http = require('http');
var moment = require('moment');
var options;
var inbound = [];
var outbound = [];
var momentDate;
// fetching infos about current day to know what date to choose for deals
var today = {dayNumber: moment().day(), hour: moment().hour()};

options = {
  host: 'http://partners.api.skyscanner.net',
  // path: "/apiservices/browseroutes/v1.0/FR/EUR/fr-FR/PARI-sky/"+SkyUECountries[i]+"/"+inboud+"/"+outbound+"?apiKey=prtl6749387986743898559646983194"
}

for (var j = 0; j < 3; j++){
  var nextWeek = (today.dayNumber >= (4 + j)) ? true : false;
  var daysToAdd = (4 + j) - moment().day();
  var nextWeekToAdd = nextWeek ? 7 : 0;

  momentDate = moment().add(daysToAdd + nextWeekToAdd, 'day')
  day = momentDate.date();
  month = momentDate.month() + 1;
  year = momentDate.year();
  if (String(day).length == 1) day = '0'+String(day);
  inbound[j] = year+'-'+month+'-'+day;

  momentDate = momentDate.add(3, 'day')
  day = momentDate.date();
  month = momentDate.month() + 1;
  year = momentDate.year();
  if (String(day).length == 1) day = '0'+String(day);
  outbound[j] = year+'-'+month+'-'+day;
}

console.log(inbound)
console.log(outbound)

for (var i = 0; i < SkyUECountries.length; i++){
  //First loop for all destinations
  var day;
  var month;
  var year;

  //Second loop for departures day
  //Verification to know what day it is and if travel needs to be on next week
}
