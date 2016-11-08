var imagesApi = require("../lib/imagesApi.js")
var http = require("http")
var statusHandler = require("./statusHandler.js")

module.exports = {
  checkErrors: function(rep){
    //algorithm to check if no errors had been found
    if (rep.status >= 200 && rep.status < 300){
      debug("SUCCESS MAGGLE", rep)
      var rep =  {data: rep.location, status: rep.status}
      rep.nextStep(rep)
      // statusHandler.autoStatus(response, rep)
    }
    else{
      // return {data: rep.error, status: rep.status}
      statusHandler.autoStatus(response, {data: {error: rep.error}, status: 422})
    }
      return false //if no errors are found, return false
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
