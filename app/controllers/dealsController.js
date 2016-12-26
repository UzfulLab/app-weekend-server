var deal = require("../models/deal.js")
var skyscannerAPI = require("../lib/skyscannerApi.js")

module.exports = {
	listDeals: function(res){
		return deal.getAllDeals(res);
	},
	customDeal: function(departureDay, returnDay, destinationCity, passengers, cityFR, cityEN, destinationCountry, internalCall, withMoment, withPicture, departureMoment, returnMoment, originCity, res){
		originCity = originCity || "PARI-sky"
		withPicture = withPicture || false
		withMoment = withMoment || false
		// TODO calling arguments verification function
		skyscannerAPI.createDeal(departureDay, returnDay, destinationCity, passengers, cityFR, cityEN, destinationCountry, internalCall, withMoment, withPicture, departureMoment, returnMoment, originCity, res)
	},
	updateDeal: function(id){
		// TODO calling arguments verification function
		return skyscannerAPI.updateDeal(id)
	}
}
