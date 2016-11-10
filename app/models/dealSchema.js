//Will be used with mongoose and get the info on the database
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dealStruct = {
	"picture_url": String,
	"author_url": String,
	"author_link": String,
	"author_name": String,
	"outboundLegId": String,
	"inboundLegId": String,
	"sessionKey": String,
	"price": String,
	"deal_url": String,
	"skyID": String,
	"cityFR": String,
	"cityEN": String,
	"destinationCountry": String,
  "passengers": Number,
  "inboundDate": Date,
  "inboundDay": Number,
  "outboundDate": Date,
  "outboundDay": Number,
	"id": Number
};

var DealSchema = new Schema(dealStruct);

// DealSchema.methods.fetchDealsByDate = function fetchDealsByDate(inbound, outbound, callback){
// 	return this.model('Deal').find({
// 		inboundDate: inbound,
// 		outboundDate: outbound
// 	}, callback)
// }

DealSchema.query.byInbound = function(inbound){
	return this.find({ inboundDate: inbound})
}

DealSchema.query.byOutbound = function(outbound){
	return this.find({ outboundDate: outbound})
}

DealSchema.query.byDates = function(outbound, inbound){
	return this.find({outboundDate: outbound, inboundDate: inbound})
}

DealSchema.query.byOutBoundThursday = function(d){
	return this.find({outboundDay: 4})
}

DealSchema.query.byOutBoundFriday = function(d){
	return this.find({outboundDay: 5})
}

DealSchema.query.byOutBoundSaturday = function(d){
	return this.find({outboundDay: 6})
}

DealSchema.query.byInBoundSunday = function(d){
	return this.find({inboundDay: 0})
}

DealSchema.query.byInBoundMonday = function(d){
	return this.find({inboundDay: 1})
}

DealSchema.query.byInBoundTuesday = function(d){
	return this.find({inboundDay: 2})
}

module.exports = mongoose.model('Deal', DealSchema);
