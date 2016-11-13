var Deal = require('./dealSchema.js');
var status = require("../lib/statusHandler.js")

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
	return ({one: one, two: two, thr: thr, fou: fou})
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
