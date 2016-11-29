var Deal = require('./dealSchema.js');
var status = require("../lib/statusHandler.js")

var sortByOutboundMoment = function(deals){
	var mor = []
	var aft = []
	var eve = []
	for (deal of deals){
		switch (deal.outboundMoment) {
			case 'M':
				mor.push(deal)
				break
			case 'A':
				aft.push(deal)
				break
			case 'E':
				eve.push(deal)
				break
			default:
				mor.push(deal)
		}
	}
	return {mor: sortByInboundMoment(mor), aft: sortByInboundMoment(aft), eve: sortByInboundMoment(eve)}
}

var sortByInboundMoment = function(deals){
	var mor = []
	var aft = []
	var eve = []
	for (deal of deals){
		switch (deal.inboundMoment) {
			case 'M':
				mor.push(deal)
				break
			case 'A':
				aft.push(deal)
				break
			case 'E':
				eve.push(deal)
				break
			default:
				mor.push(deal)
		}
	}
	return {mor: mor, aft: aft, eve: eve}
}

var sortByPassengers = function(tab){
	var one = []
	var two = []
	var thr = []
	var fou = []
	for (entrie of tab){
		switch (entrie.passengers) {
			case 1:
				one.push(entrie)
				break;
			case 2:
				two.push(entrie)
				break;
			case 3:
				thr.push(entrie)
				break;
			case 4:
				fou.push(entrie)
				break;
			default:
				one.push(entrie)
		}
	}
	return ({one: sortByOutboundMoment(one), two: sortByOutboundMoment(two), thr: sortByOutboundMoment(thr), fou: sortByInboundMoment(fou)})
}

module.exports = {
	getAllDeals: function(){
		deals = require("./deals.json")
		Deal.find().byThuSun().exec(function(err, deals){
				byThuSun = deals
				Deal.find().byThuSun().exec(function(err, deals){
					byThuMon = deals
					Deal.find().byThuTue().exec(function(err, deals){
						byThuTue = deals
						Deal.find().byFriSun().exec(function(err, deals){
							byFriSun = deals
							Deal.find().byFriMon().exec(function(err, deals){
								byFriMon = deals
								Deal.find().byFriTue().exec(function(err, deals){
									byFriTue = deals
									Deal.find().bySatSun().exec(function(err, deals){
										bySatSun = deals
										Deal.find().bySatSun().exec(function(err, deals){
											bySatMon = deals
											Deal.find().bySatSun().exec(function(err, deals){
												bySatTue = deals
												var rep = {data:
													{
														thu:{
															sun:
																sortByPassengers(byThuSun)
															,
															mon:
																sortByPassengers(byThuMon)
															,
															tue:
																sortByPassengers(byThuTue)

														},
														fri:{
															sun:
																sortByPassengers(byFriSun)
															,
															mon:
																sortByPassengers(byFriMon)
															,
															tue:
																sortByPassengers(byFriTue)

														},
														sat:{
															sun:
																sortByPassengers(bySatSun)
															,
															mon:
																sortByPassengers(bySatMon)
															,
															tue:
																sortByPassengers(bySatTue)
														}
													},
													status: 200
												}
												status.autoStatus(response, rep)
											})
										})
									})
								})
							})
						})
					})
				})
			})
		}
	}
