var Deal = require("../../models/dealSchema.js")
var moment = require('moment')
var statusHandler = require("../statusHandler.js")

var createDealFinalReturn = function(sessionData){
  var skyData = sessionData.data
  var bestQuote = skyData.Itineraries[0]
  // statusHandler.autoStatus(sessionData.res, Object.assign({data: sessionData.cityFR}, {status: 200}))
  // return
  if (!sessionData.data.internalCall && typeof(bestQuote) === 'undefined')
    statusHandler.autoStatus(sessionData.data.res, Object.assign({data: {error: "NO deals found"}}, {status: 422}))
  if (typeof(bestQuote) !== 'undefined'){
    var price = String(bestQuote.PricingOptions[0].Price).replace('.', ',')
    var cityFR = sessionData.cityFR
    var cityEN = sessionData.cityEN
    var outboundMoment = sessionData.outboundMoment
    var inboundMoment = sessionData.inboundMoment
    var destinationCountry = sessionData.destinationCountry
    var countryFR = UECountries[destinationCountry]
    var countryEN = UECountries[destinationCountry]
    var passengers = skyData.Query.Adults
    var inboundDate = skyData.Query.InboundDate
    var outboundDate = skyData.Query.OutboundDate
    var deal_url = bestQuote.PricingOptions[0].DeeplinkUrl
    var picture_url = countryPictures[destinationCountry].pictureUrl
    var author_name = countryPictures[destinationCountry].authorName
    var author_link = countryPictures[destinationCountry].authorLink
    var outboundLegId = bestQuote.OutboundLegId
    var inboundLegId = bestQuote.InboundLegId
    var sessionKey = skyData.SessionKey
    var created_at = new Date()
    var deal = new Deal()
    deal.cityFR = cityFR
    deal.cityEN = cityEN
    deal.destinationCountry = destinationCountry
    deal.countryFR = countryFR
    deal.countryEN = countryEN
    deal.outboundMoment = outboundMoment
    deal.inboundMoment = inboundMoment
    deal.price = price
    deal.picture_url = picture_url
    deal.author_name = author_name
    deal.author_link = author_link
    deal.deal_url = deal_url
    deal.passengers = passengers
    deal.inboundDate = inboundDate
    deal.inboundDay = moment(deal.inboundDate).day()
    deal.inboundLegId = inboundLegId
    deal.outboundDate = outboundDate
    deal.outboundDay = moment(deal.outboundDate).day()
    deal.outboundLegId = outboundLegId
    deal.sessionKey = sessionKey
    deal.created_at = created_at
    deal.save((err) =>{
      if (err){
        debug("\n\n\n==========================ERROR DEAL SAVE===================================", err)
        if (!sessionData.data.internalCall)
          statusHandler.autoStatus(sessionData.res, Object.assign({data: {error: "Database save problem"}}, {status: 422}))
      }
      else{
        // var query = Deal.remove( { inboundLegId: String(inboundLegId), outboundLegId: String(outboundLegId), passengers: passengers, inboundDate: inboundDate, outboundDate: outboundDate, outboundMoment: outboundMoment, inboundMoment: inboundMoment, price: price } ).where("created_at").ne(created_at)
        // query.exec()
        debug("DEAL SAVED", deal.countryFR + ` - ${deal.cityFR} - ${deal.outboundMoment} - ${deal.inboundMoment}`)
        // Deal.remove({outboundLegId: outboundLegId, inboundLegId: inboundLegId})
        if (!sessionData.internalCall){
          debug("6- RESPONSE", "External Response")
          statusHandler.autoStatus(sessionData.res, Object.assign({data: deal}, {status: 200}))
        }
      }
    })
  }
}

module.exports = createDealFinalReturn
