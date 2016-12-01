var createSession = function(departureDay, returnDay, destinationCity, passengers, cityFR, cityEN, destinationCountry, internalCall, withMoment, withPicture, departureMoment, returnMoment, originCity, res, self){
  debug("FUNCTION NAME ==> createSession")
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
    debug("createSession status", status)
    var oldArgs = [departureDay, returnDay, destinationCity, passengers, cityFR, cityEN, destinationCountry, internalCall, withMoment, withPicture, departureMoment, returnMoment, originCity, res]
    // self.checkErrors({location: location, status: status, error: error, cityFR: cityFR, cityEN: cityEN, destinationCountry: destinationCountry, internalCall: internalCall, withMoment: withMoment, withPicture: withPicture, res: res, oldArgs: oldArgs, when: new Date(), nextStep: self.pollingSession})
    self.checkErrors({location: location, status: status, error: error, cityFR: cityFR, cityEN: cityEN, destinationCountry: destinationCountry, internalCall: internalCall, withMoment: withMoment, withPicture: withPicture, res: res, oldArgs: oldArgs, when: new Date(), nextStep: "pollingSession"})
  })
}

module.exports = createSession
