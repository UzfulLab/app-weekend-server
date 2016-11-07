SkyUECountries = [
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

UECountries = {
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

SkyScannerApiKey = "uz497893624968959685836267896543"

var Bottleneck = require("bottleneck");
limiter = new Bottleneck(1, 100);

debug = require('debug')('worker');

mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/app-weekend')

schedule = require('node-schedule');

TOTALDEALS = 3
