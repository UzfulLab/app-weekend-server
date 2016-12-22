var imagesApi = require("../lib/imagesApi.js")
var statusHandler = require("./statusHandler.js")
var httpCalls = require("./httpCalls.js")
var createDeal = require('./helpers/createDeal.js')
var createSession = require('./helpers/createSession.js')
var pollingSession = require('./helpers/pollingSession.js')
var curlPollSession = require('./helpers/curlPollSession.js')
var createDealFinalReturn = require('./helpers/createDealFinalReturn.js')

module.exports = {
  checkErrors: function(rep){
    //algorithm to check if no errors had been found
    if (rep.status >= 200 && rep.status < 300){
      debug("CHECK ERRORS: none")
      var object =  {data: rep, status: rep.status}
      this[rep.nextStep](object)
    }
    else{
      debug("CHECK ERRORS: /!\\error found/!\\", rep)
      if (typeof(rep.res) !== 'undefined' )
        statusHandler.autoStatus(rep.res, {data: {error: rep.error}, status: 422})
    }
  },
  createDealFinalReturn: function(sessionData){
    createDealFinalReturn(sessionData)
  },
  createSession: function(departureDay, returnDay, destinationCity, passengers, cityFR, cityEN, destinationCountry, internalCall, withMoment, withPicture, departureMoment, returnMoment, originCity, res, attempts){
    // var url //API call for creating session
    var self = this
    createSession(departureDay, returnDay, destinationCity, passengers, cityFR, cityEN, destinationCountry, internalCall, withMoment, withPicture, departureMoment, returnMoment, originCity, res, attempts, self)
  },
  pollingSession: function(session){
    var self = this
    pollingSession(session, self)
  },
  curlPollSession: function(session, outboundMoment, inboundMoment){
    var self = this
    curlPollSession(session, outboundMoment, inboundMoment, self)
  },
  selectBestDeal: function(deal){
    // algorithm to select best deal among skyscanner return
    return {city: "Dublin", price: "42,42", deal: "http://google.fr", id: "f4k3id23123"}
  },
  updateDeal: function(id){
    // function to update a deal's price
    // call to skyscanner API and getting new price
    return {data:{newPrice: "142,21"}, status: 200}
  },
  createDeal: function(departureDay, returnDay, destinationCity, passengers, cityFR, cityEN, destinationCountry, internalCall, withMoment, withPicture, departureMoment, returnMoment, originCity, res){
    var self = this
    createDeal(departureDay, returnDay, destinationCity, passengers, cityFR, cityEN, destinationCountry, internalCall, withMoment, withPicture, departureMoment, returnMoment, originCity, res, self)
  }
}
