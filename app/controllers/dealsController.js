var deal = require("../models/deal.js")
var skyscannerAPI = require("../lib/skyscannerAPI.js")

module.exports = {
	listDeals: function(){
		return deal.getAllDeals();
	},
	customDeal: function(departureDay, departureMoment, returnDay, returnMoment, destinationCity, originCity, withPicture){
		originCity = originCity || "PARI-sky"
		withPicture = withPicture || false
		// calling arguments verification function
		return skyscannerAPI.createDeal(departureDay, departureMoment, returnDay, returnMoment, destinationCity, originCity, withPicture)
	},
	updateDeal: function(id){
		// calling arguments verification function
		return skyscannerAPI.updateDeal(id)
	}
}
