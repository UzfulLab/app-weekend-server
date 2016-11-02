//Will be used with mongoose and get the info on the database
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dealStruct = {
	"city": String,
	"picture_url": String,
	"price": String,
	"deal_url": String,
	"id": String,
  "passengers": Number,
  "inboundDate": Date,
  "outboundDate": Date,
	"id": Number
};

var DealSchema = new Schema(dealStruct);

module.exports = mongoose.model('Deal', DealSchema);
