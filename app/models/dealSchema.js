//Will be used with mongoose and get the info on the database
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dealStruct = {
	"picture_url": {type: String, required: true},
	"author_link": {type: String, required: true},
	"author_name": {type: String, required: true},
	"outboundLegId": {type: String, required: true},
	"inboundLegId": {type: String, required: true},
	"sessionKey": {type: String, required: true},
	"price": {type: String, required: true},
	"deal_url": {type: String, required: true},
	"cityFR": {type: String, required: true},
	"cityEN": {type: String, required: true},
	"outboundMoment": {type: String, required: true},
	"inboundMoment": {type: String, required: true},
	"countryFR": {type: String, required: true},
	"countryEN": {type: String, required: true},
	"destinationCountry": {type: String, required: true},
	"destinationCity": {type: String, required: true},
  "passengers": {type: Number, required: true},
  "inboundDate": {type: Date, required: true},
  "inboundDay": {type: Number, required: true},
  "outboundDate": {type: Date, required: true},
  "outboundDay": {type: Number, required: true},
	"initialDeal": {type: Boolean, required: true},
	"created_at": Date
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



DealSchema.query.byThuSun = function(){
	return this.find({outboundDay: 4, inboundDay: 0})
}

DealSchema.query.byThuMon = function(){
	return this.find({outboundDay: 4, inboundDay: 1})
}

DealSchema.query.byThuTue = function(){
	return this.find({outboundDay: 4, inboundDay: 2})
}

DealSchema.query.byFriSun = function(){
	return this.find({outboundDay: 5, inboundDay: 0})
}

DealSchema.query.byFriMon = function(){
	return this.find({outboundDay: 5, inboundDay: 1})
}

DealSchema.query.byFriTue = function(){
	return this.find({outboundDay: 5, inboundDay: 2})
}

DealSchema.query.bySatSun = function(){
	return this.find({outboundDay: 6, inboundDay: 0})
}

DealSchema.query.bySatMon = function(){
	return this.find({outboundDay: 6, inboundDay: 1})
}

DealSchema.query.bySatTue = function(){
	return this.find({outboundDay: 6, inboundDay: 2})
}

DealSchema.query.byOutboundMorning = function(){
	return this.find({outboundMoment: 'M'})
}

DealSchema.query.byOutboundAfternoon = function(){
	return this.find({outboundMoment: 'A'})
}

DealSchema.query.byOutboundEvening = function(){
	return this.find({outboundMoment: 'E'})
}

DealSchema.query.byInboundMorning = function(){
	return this.find({inboundMoment: 'M'})
}

DealSchema.query.byInboundAfternoon = function(){
	return this.find({inboundMoment: 'A'})
}

DealSchema.query.byInboundEvening = function(){
	return this.find({inboundMoment: 'E'})
}


module.exports = mongoose.model('Deal', DealSchema);
