var deal = require("../models/deal.js")
var skyscannerAPI = require("../lib/skyscannerAPI.js")

module.exports = {
	listDeals: function(){
		return deal.getAllDeals();
	},
	customDeal: function(departureDay, returnDay, destinationCity, passengers, cityFR, cityEN, destinationCountry, internalCall, withMoment, withPicture, departureMoment, returnMoment, originCity){
		originCity = originCity || "PARI-sky"
		withPicture = withPicture || false
		withMoment = withMoment || false
		// calling arguments verification function
		skyscannerAPI.createDeal(departureDay, returnDay, destinationCity, passengers, cityFR, cityEN, destinationCountry, internalCall, withMoment, withPicture, departureMoment, returnMoment, originCity)
	},
	updateDeal: function(id){
		// calling arguments verification function
		return skyscannerAPI.updateDeal(id)
	}
}
