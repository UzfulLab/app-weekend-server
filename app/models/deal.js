var Deal = require('./dealSchema.js');
var status = require("../lib/statusHandler.js")

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
															sun:{
																byThuSun
															},
															mon:{
																byThuMon
															},
															tue:{
																byThuTue
															}
														},
														fri:{
															sun:{
																byFriSun
															},
															mon:{
																byFriMon
															},
															tue:{
																byFriTue
															}
														},
														sat:{
															sun:{
																bySatSun
															},
															mon:{
																bySatMon
															},
															tue:{
																bySatTue
															}
														}
													},
													status: 200
												}
												debug("REEEP", rep)
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
