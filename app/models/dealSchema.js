//Will be used with mongoose and get the info on the database
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dealStruct = {
	"picture_url": String,
	"author_url": String,
	"author_link": String,
	"author_name": String,
	"price": String,
	"deal_url": String,
	"skyID": String,
	"cityFR": String,
	"cityEN": String,
	"destinationCountry": String,
  "passengers": Number,
  "inboundDate": Date,
  "outboundDate": Date,
	"id": Number
};

var DealSchema = new Schema(dealStruct);

module.exports = mongoose.model('Deal', DealSchema);
