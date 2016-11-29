var imagesApi = require("../lib/imagesApi.js")
var http = require("http")
var statusHandler = require("./statusHandler.js")
var httpCalls = require("./httpCalls.js")
var Deal = require("../models/dealSchema.js")
var moment = require('moment')

var emptyCheck = function(data){
  if (!data)
    return false
  if (!data.Itineraries)
    return false
  if (!data.Itineraries[0])
    return false
  if (!data.Itineraries[0].PricingOptions)
    return false
  if (!data.Itineraries[0].PricingOptions[0])
    return false
  if (!data.Itineraries[0].PricingOptions[0].DeeplinkUrl)
    return false
  return true
}

module.exports = {
  checkErrors: function(rep){
    //algorithm to check if no errors had been found
    if (rep.status >= 200 && rep.status < 300){
      debug("\n\nNO ERRORS")
      var object =  {data: rep, status: rep.status}
      debug(rep.nextStep.toString().substr('function '.length).substr(0, 20))
      rep.nextStep(object)
    }
    else{
      debug("\n\nERRORS\n\n", rep)
      if (typeof(rep.res) !== 'undefined' )
        statusHandler.autoStatus(rep.res, {data: {error: rep.error}, status: 422})
    }
  },
  createDealFinalReturn: function(sessionData){
    var skyData = sessionData.data.data
    var bestQuote = skyData.Itineraries[0]
    if (!sessionData.data.internalCall && typeof(bestQuote) === 'undefined')
      statusHandler.autoStatus(sessionData.data.res, Object.assign({data: {error: "NO deals found"}}, {status: 422}))
    if (typeof(bestQuote) !== 'undefined'){
      var price = String(bestQuote.PricingOptions[0].Price).replace('.', ',')
      var cityFR = sessionData.data.cityFR
      var cityEN = sessionData.data.cityEN
      var outboundMoment = sessionData.data.outboundMoment
      var inboundMoment = sessionData.data.inboundMoment
      var destinationCountry = sessionData.data.destinationCountry
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
            statusHandler.autoStatus(sessionData.data.res, Object.assign({data: {error: "Database save problem"}}, {status: 422}))
        }
        else{
          var query = Deal.remove( { inboundLegId: String(inboundLegId), outboundLegId: String(outboundLegId) } ).where("created_at").ne(created_at)
          query.exec()
          debug("5 - DEAL SAVED", deal.countryFR)
          debug("6 - INTERN CALL ?", sessionData.data.internalCall)
          // Deal.remove({outboundLegId: outboundLegId, inboundLegId: inboundLegId})
          if (!sessionData.data.internalCall){
            debug("7 - RESPONSE", "External Response")
            statusHandler.autoStatus(sessionData.data.res, Object.assign({data: deal}, {status: 200}))
          }
        }
      })
    }
  },
  createSession: function(departureDay, returnDay, destinationCity, passengers, cityFR, cityEN, destinationCountry, internalCall, withMoment, withPicture, departureMoment, returnMoment, originCity, res){
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
      'adults': passengers
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
      debug("location", location)
      debug("status", status)
      self.checkErrors({location: location, status: status, error: error, cityFR: cityFR, cityEN: cityEN, destinationCountry: destinationCountry, internalCall: internalCall, withMoment: withMoment, withPicture: withPicture, res: res, nextStep: self.pollingSession})
    })

  },
  pollingSession: function(session){
    debug("\n\n1 - Polling Session")

    var flag = false
    var departureMoments
    if (session.data.withMoment)
      departureMoments = ['M', 'A', 'E']
    else
      departureMoments = ['M;A;E']

    for (var i = 0; i < departureMoments.length; i++){
      if (flag) break
      for (var j = 0; j < departureMoments.length; j++){
        var path = session.data.location.split("http://partners.api.skyscanner.net")[1]
        path += `&outbounddeparttime=${departureMoments[i]}`
        path += `&inbounddeparttime=${departureMoments[j]}`
        path += "&sortype=price"

        var options = {
          hostname: "partners.api.skyscanner.net",
          path: path,
          method: "GET",
          headers: {
            'Content-Type': "application/x-www-form-urlencoded"
          },
          outboundMoment: departureMoments[i],
          inboundMoment: departureMoments[j]
        }


          limiterPollSession.submit(function(options, cb){
            // debug("============OPTIONS============", options.outboundMoment)
            // debug("============OPTIONS============", options.inboundMoment)
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
                try{
                  cb(JSON.parse(body), status, "", options.outboundMoment, options.inboundMoment)
                }
                catch(err){
                  debug("\n\n\n====================================2 - FAT BUG===============================")
                  flag = true
                  cb('', 422)
                  // self.pollingSession(session)
                  // cb({data: {body: "error while pulling deal"}}, 422, err, '', '')
                }
              })
            })

            req.on('error', (e) => {
              debug("REQUEST ",`problem with request: ${e.message}`);
              debug("CALLBACK CALLING ON ERROR")
              cb({data: {body: "error"}}, status, e.message, '', '')
            })

            req.end()

          }, options, (data, status, error, outboundMoment, inboundMoment) => {
            if (flag) self.pollingSession(session)
            error = error || ''
            debug('3 - POLING STATUS', status)
            if (emptyCheck(data))
              self.checkErrors({data, status: status, cityFR: session.data.cityFR, cityEN: session.data.cityEN, internalCall: session.data.internalCall, destinationCountry: session.data.destinationCountry, outboundMoment: outboundMoment, inboundMoment: inboundMoment, res: session.data.res, nextStep: self.createDealFinalReturn})
            else{
              debug("4 - __________EMPTY__________")
              flag = true
              self.pollingSession(session)
            }
          })

      }
    }
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
    // ONLY FOR DEV - SIMULATE SKYSCANNER API DOWN
    internalCall = internalCall || false
    if (departureDay == "createError")
      return {data: {error: "Front created voluntarily an error to simulate skyscanner api down"}, status: 422}

    self = this
    this.createSession(departureDay, returnDay, destinationCity, passengers, cityFR, cityEN, destinationCountry, internalCall, withMoment, withPicture, departureMoment, returnMoment, originCity, res)
  }
}
