var imagesApi = require("../lib/imagesApi.js")
var http = require("http")

module.exports = {
  checkErrors: function(rep){
    //algorithm to check if no errors had been found
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
      'outbounddate': returnDay,
      'inbounddate': departureDay,
      'adults': adults
    })

    var options = {
      hostname: "partners.api.skyscanner.net",
      path: "/apiservices/pricing/v1.0",
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }

    limiter.submit(function(options, cb){
      debug("\n\n\n\n\nHELLO WORLD ?\n\n\n\n", options)
      var req = http.request(options, (res) => {
        debug("\n\n\n\n\nREQUEST ",`STATUS: ${res.statusCode}`);
        debug("\n\n\n\n\nREQUEST ",`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          debug("\n\n\n\n\nREQUEST ",`BODY: ${chunk}`);
        });
        res.on('end', () => {
          debug("\n\n\n\n\nREQUEST ",'No more data in response.');
          debug("CALLBACK CALLING")
          cb()
          // return "url"
        });
      });

      req.on('error', (e) => {
        debug("REQUEST ",`problem with request: ${e.message}`);
        debug("CALLBACK CALLING")
        cb()
      });

      req.end()
    }, options, function(){
      debug("!!!!!!!CALLBACK!!!!!!!")
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
    var session = this.createSession(departureDay, returnDay, destinationCity, passengers)
    if (this.checkErrors(session))
      return {data: session, status: session.status}
    var tmpDeal = this.pollingSession(session)
    if (this.checkErrors(tmpDeal))
      return {data: session, status: session.status}

    // ONLY FOR DEV - SIMULATE SKYSCANNER API DOWN

    if (departureDay == "createError")
      return {data: {error: "Front created voluntarily an error to simulate skyscanner api down"}, status: 422}

    var deal = this.selectBestDeal(tmpDeal)
    if (!withPicture)
      return {data: deal, status: 200}
    var picture = imagesApi.findPhoto(destinationCity)
    var data = Object.assign(deal, {picture: picture})
    return {data: deal, status: 200}
  }
}
