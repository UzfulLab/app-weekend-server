var deal = require("../models/deal.js")
var skyscannerAPI = require("../lib/skyscannerAPI.js")

module.exports = {
	listDeals: function(){
		return deal.getAllDeals();
	},
	customDeal: function(departureDay, departureMoment, returnDay, returnMoment, destinationCity, originCity){
		originCity = originCity || "PARI-sky"
		// calling arguments verification function
		return skyscannerAPI.createDeal(departureDay, departureMoment, returnDay, returnMoment, destinationCity, originCity)
	}
}
