module.exports = {
  fetchDeals: function(){

    var http = require('http')
    var moment = require('moment')

    var inbound = []
    var outbound = []
    var momentDate
    var quotes = []
    var counter = 0
    var bestDeals = {prices: [], destinations: []}
    // fetching infos about current day to know what date to choose for deals
    var today = {dayNumber: moment().day(), hour: moment().hour()}

    var Deal = require('../models/dealSchema.js')

    var findGoodDate = function(){
      var day = momentDate.date()
      var month = momentDate.month() + 1
      var year = momentDate.year()
      if (String(day).length == 1) day = '0'+String(day)
      return year+'-'+month+'-'+day
    }

    var sortValues = function(prices, destinations, destinationName, valuePrice){
      prices.push(valuePrice)
      destinations.push(destinationName)
      var destPric = []
      var ob = {}
      for (var l = 0; l < prices.length; l++){
        if (typeof(ob[prices[l]]) !== "undefined" ){
          ob[prices[l]] = destinations[l]
          destPric[l] = ob
        }
        else{
          ob[prices[l] + '1'] = destinations[l]
          destPric[l] = ob
        }
      }
      prices.sort(function(a, b){
        return a - b
      })
      if (prices.length > 3)
        prices.pop()
      var finalObj = {}
      for (var l = 0; l < prices.length; l++){
        // prices[l]
        debug("OREIWOPRIWPOREI", ob[prices[l]])
        // destinations[l] = ob[prices[l]]
      }
      debug("OBJECT TEST\n\n", destinations)
    }

    for (var i = 0; i < 3; i++){
      var nextWeek = (today.dayNumber >= (4 + i)) ? true : false;
      var nextWeekToAdd = nextWeek ? 7 : 0
      var daysToAdd = (4 + i) - moment().day() + nextWeekToAdd
      momentDate = moment().add(daysToAdd, 'day')
      inbound[i] = findGoodDate()

      outbound[i] = []
      momentDate = momentDate.add(7 - 1 - momentDate.day(), 'day')
      //minus one corresponds to the first momentDate.add(1, 'day') on the for loop
      for (var j = 0; j < 3; j++){
        momentDate = momentDate.add(1, 'day')
        outbound[i][j] = findGoodDate()
      }
    }

    for (var i = 0; i < inbound.length; i++){
      bestDeals.prices[i] = []
      bestDeals.destinations[i] = []
      for (var j = 0; j < outbound.length; j++){
        bestDeals.prices[i][j] = []
        bestDeals.destinations[i][j] = []
      }
    }

    // debug(bestDeals.prices[0][0])
    // debug(bestDeals.prices[0][1])
    // debug(bestDeals.prices[0][2])
    // debug(bestDeals.prices[1][0])
    // debug(bestDeals.prices[1][1])
    // debug(bestDeals.prices[1][2])
    // debug(bestDeals.prices[2][0])
    // debug(bestDeals.prices[2][1])
    // debug(bestDeals.prices[2][2])


    //First loop for all destinations
    for (var i = 0; i < SkyUECountries.length; i++){
      //Second loop for inbound days
      for (var j = 0; j < inbound.length; j++){
        //Third loop for outbound days
        for (var k = 0; k < outbound.length; k++){

          var options = {
            hostname: 'partners.api.skyscanner.net',
            path: "/apiservices/browseroutes/v1.0/FR/EUR/fr-FR/PARI-sky/"+SkyUECountries[i]+"/"+inbound[j]+"/"+outbound[j][k]+"?apiKey="+SkyScannerApiKey,
            inboundDay: j,
            outboundDay: k
          }

          limiter.submit(function(options, cb){
            var req = http.get(options, function(res) {
              var body = ""
              // debug("INBOUND DAY", options.inboundDay)
              // debug("OUTBOUND DAY", options.outboundDay)
              res.on('data', function(chunk) {
                body += chunk.toString('utf-8')
              })
              res.on('end', function() {
                var currentQuotes = JSON.parse(body)["Quotes"]
                if (currentQuotes.length > 0){
                  currentQuotes.sort(function(a,b){
                    return a.MinPrice - b.MinPrice
                  })
                  quotes.push(currentQuotes[0])
                  if (typeof(currentQuotes[0].OutboundLeg) !== "undefined" && typeof(currentQuotes[0].OutboundLeg.DestinationId) !== "undefined"){
                    // debug("QUOTE", quotes[quotes.length - 1])
                    // debug("QUOTE", quotes[quotes.length - 1])
                    debug("\n\n\n\n====BUG BESTDEALS====", bestDeals.prices)
                    // debug("====BUG OPTIONS INBOUND DAY====", options.inboundDay)
                    // debug("====BUG OPTIONS OUTBOUND DAY====", options.outboundDay)
                    // debug("CURRENT QUOTES", currentQuotes[0])
                    sortValues(bestDeals.prices[options.inboundDay][options.outboundDay], bestDeals.destinations[options.inboundDay][options.outboundDay],currentQuotes[0].OutboundLeg.DestinationId, currentQuotes[0].MinPrice)
                  }
                }
                // debug("\n\n\nDEAL VALUE", bestDeals.prices)
                counter++
                cb()
              })
            })
            req.on('error', function(e) {
              debug('ERROR: ' + e.message + '\n' + counter)
              debug('FUNCTION ERROR')
              cb()
              counter++
            })
          }, options, function(){
            // debug("BESTDEAL TAB", j)
            // sortValues(bestDeals.prices[j], quotes[quotes.length - 1].price)
            // debug("DEAL VALUE", bestDeals.prices)
            // debug("CALLBACK", `NEED TO SORT DEALS + IF COUNTER ${counter} IS EQUAL TO 3*3*50 TO PASS TO SECOND algorithm`)
          })
        }
      }
    }
  }
}


/* ==== FUNCTION FOR DATABASE ==== */
/*

var deal = new Deal()
deal.id = counter
deal.price = String(quotes[0].MinPrice)

deal.save(function(err){
  if (err)
    debug("ERROR DEAL SAVE ==> "+err)

  debug("DEAL SAVED ==> "+counter+'\n\n\n\n')
  debug('RES.ON.END')
  cb()
  counter++;
})


*/
