var imagesApi = require("../lib/imagesApi.js")
var http = require("http")
var statusHandler = require("./statusHandler.js")
var httpCalls = require("./httpCalls.js")
var Deal = require("../models/dealSchema.js")

module.exports = {
  checkErrors: function(rep){
    //algorithm to check if no errors had been found
    if (rep.status >= 200 && rep.status < 300){
      debug("\n\nSUCCESS CHECK ERRORS\n\n")
      var object =  {data: rep, status: rep.status}
      rep.nextStep(object)
    }
    else{
      debug("\n\nFAILURE CHECK ERRORS\n\n", rep)
      statusHandler.autoStatus(response, {data: {error: rep.error}, status: 422})
    }
  },
  createDealFinalReturn: function(data){

    // debug("DATA", data)
    // debug("DATADATADATA", data.data.data)
    var data = data.data.data
    var bestQuote = data.Itineraries[0]
    var price = String(bestQuote.PricingOptions[0].Price).replace('.', ',')
    if (price[2] != '.') price += '.'
    while(price.length < 5)
      price += '0'
    // var city = data.city
    var city = "NANTES"
    var passengers = data.Query.Adults
    var inboundDate = data.Query.InboundDate
    var outboundDate = data.Query.OutboundDate
    var deal_url = bestQuote.PricingOptions[0].DeeplinkUrl
    var deal = new Deal()
    deal.city = city
    deal.price = price
    deal.deal_url = deal_url
    deal.passengers = passengers
    deal.inboundDate = inboundDate
    deal.outboundDate = outboundDate

    deal.save((err) =>{
      if (err){
        debug("ERROR DEAL SAVE", err)
        statusHandler.autoStatus(response, Object.assign({data: data}, {status: 422}))
      }
      else{
        debug("DEAL SAVED")
        statusHandler.autoStatus(response, Object.assign({data: deal}, {status: 200}))
      }
    })
  },
  createSession: function(departureDay, returnDay, destinationCity, adults){
    // var url //API call for creating session
    var querystring = require('querystring');

    var postData = querystring.stringify({
      'apiKey' : SkyScannerApiKey,
      'country': 'FR',
      'currency': 'EUR',
      'locale': 'fr-FR',
      'originplace': 'PARI-sky',
      'destinationplace': destinationCity,
      'outbounddate': departureDay,
      'inbounddate': returnDay,
      'adults': adults
    })

    var options = {
      hostname: "partners.api.skyscanner.net",
      path: "/apiservices/pricing/v1.0",
      method: "POST",
      headers: {
        'Content-Type': "application/x-www-form-urlencoded",
        'Accept': "application/json",
        'Content-Length': Buffer.byteLength(postData)
      }
    }

    limiter.submit(function(options, cb){
      var location
      var status
      var req = http.request(options, (res) => {
        status = res.statusCode
        location = res.headers.location
        res.setEncoding('utf8')
        res.on('data', (chunk) => {})
        res.on('end', () => {
          cb(location + "?apiKey=" + SkyScannerApiKey, status)
        })
      })

      req.on('error', (e) => {
        debug("REQUEST ",`problem with request: ${e.message}`);
        debug("CALLBACK CALLING ON ERROR")
        cb("error", status, e.message)
      })

      req.end(postData)

    }, options, function(location, status, error){
      error = error || ''
      debug(location)
      debug(status)
      self.checkErrors({location: location, status: status, error: error, nextStep: self.pollingSession})
    })

  },
  pollingSession: function(session){
    debug("\n\nPolling Session\n\n")

    var path = session.data.location.split("http://partners.api.skyscanner.net")[1]

    var options = {
      hostname: "partners.api.skyscanner.net",
      path: path,
      method: "GET",
      headers: {
        'Content-Type': "application/x-www-form-urlencoded"
      }
    }

    setTimeout(() => {
      limiter.submit(function(options, cb){
        debug("OPTIONS", options)
        var status
        var req = http.get(options, function(res) {
          var body = ""
          status = res.statusCode
          res.setEncoding('utf8')
          //response is too long so we need to concatenate it
          res.on('data', (chunk) => {
            body += chunk.toString('utf-8')
          })
          res.on('end', () => {
            cb(JSON.parse(body), status)
          })
        })

        req.on('error', (e) => {
          debug("REQUEST ",`problem with request: ${e.message}`);
          debug("CALLBACK CALLING ON ERROR")
          cb({data: {body: "error"}}, status, e.message)
        })

        req.end()

      }, options, (data, status, error) => {
        error = error || ''
        debug(status)
        self.checkErrors({data, status: status, nextStep: self.createDealFinalReturn})
      })
    }, 10000)

    var deals //API call for polling session
    return deals
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
  createDeal: function(departureDay, returnDay, destinationCity, passengers, withPicture, departureMoment, returnMoment, originCity){
    //supposingly calling skyscanner API and choosing best deal
    self = this
    this.createSession(departureDay, returnDay, destinationCity, passengers)
    // if (this.checkErrors(session))
    //   return {data: session, status: session.status}

    // var tmpDeal = this.pollingSession(session)


    // if (this.checkErrors(tmpDeal))
    //   return {data: session, status: session.status}

    // ONLY FOR DEV - SIMULATE SKYSCANNER API DOWN

    if (departureDay == "createError")
      return {data: {error: "Front created voluntarily an error to simulate skyscanner api down"}, status: 422}

    // var deal = this.selectBestDeal(tmpDeal)
    // if (!withPicture)
    //   return {data: deal, status: 200}
    // var picture = imagesApi.findPhoto(destinationCity)
    // var data = Object.assign(deal, {picture: picture})
    // return {data: deal, status: 200}
  }
}
