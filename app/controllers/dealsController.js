var deal = require("../models/deal.js")

module.exports = {
	listDeals: function(){
		return deal.getAllDeals();
	},
	customDeal: function(departureDay, departureMoment, returnDay, returnMoment, destinationCity, originCity){
		originCity = originCity || "PARI-sky"
		//supposingly calling skyscanner API and choosing best deal
		//calling also image API and adding illustration to json return
	}
}
