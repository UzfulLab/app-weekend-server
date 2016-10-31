var Deal = require('./dealSchema.js');

module.exports = {
	// It is supposed to connect to Database and fetch all current deals
	getAllDeals: function(){
		// simultating a database call to get all default stocked deals
		deals = require("./deals.json")
		return {data: deals, status: 200}
	}
};
