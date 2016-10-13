var deal = require("../models/deal.js")

module.exports = {
	listDeals: function(){
		return deal.getAllDeals();
	}
}