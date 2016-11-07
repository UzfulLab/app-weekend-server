var skyscannerController = require("../lib/skyscannerApi.js")

module.exports = {
  fetchDeals: function(){

    var http = require('http')
    var moment = require('moment')

    var inbound = []
    var outbound = []
    var momentDate
    var finalDeals = []
    var ids = []
    var counter = 0
    var bestDeals = {prices: [], destinations: [], ids: []}
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

    var sortValues = function(prices, destinations, ids, destinationName, valuePrice, id){
      prices.push(valuePrice)
      destinations.push(destinationName)
      ids.push(id)
      var destPric = []
      for (var l = 0; l < prices.length; l++){
        destPric.push({dest: destinations[l], price: prices[l], id: ids[l]})
      }

      destPric.sort(function(a, b){
        return (a.price - b.price)
      })

      for (var l = 0; l < destPric.length; l++){
        prices[l] = destPric[l].price
        destinations[l] = destPric[l].dest
        ids[l] = destPric[l].id
      }

      while (destPric.length > 3)
        destPric.pop()
      while (prices.length > 3)
        prices.pop()
      while (destinations.length > 3)
        destinations.pop()
      while (ids.length > 3)
        ids.pop()

      return destPric
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
      bestDeals.ids[i] = []
      finalDeals[i] = []
      for (var j = 0; j < outbound.length; j++){
        bestDeals.prices[i][j] = []
        bestDeals.destinations[i][j] = []
        bestDeals.ids[i][j] = []
        finalDeals[i][j] = []
      }
    }

    debug("WORKER", "Lunching deal seaking")
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
              res.on('data', function(chunk) {
                body += chunk.toString('utf-8')
              })
              res.on('end', function() {
                var currentQuotes = JSON.parse(body)["Quotes"]
                var places = JSON.parse(body)["Places"]
                if (currentQuotes.length > 0){
                  currentQuotes.sort(function(a,b){
                    return a.MinPrice - b.MinPrice
                  })
                  if (typeof(currentQuotes[0].OutboundLeg) !== "undefined" && typeof(currentQuotes[0].OutboundLeg.DestinationId) !== "undefined"){
                    var prices = bestDeals.prices[options.inboundDay][options.outboundDay]
                    var destinations = bestDeals.destinations[options.inboundDay][options.outboundDay]
                    var destinationName = currentQuotes[0].OutboundLeg.DestinationId
                    var valuePrice = currentQuotes[0].MinPrice
                    var ids = bestDeals.ids[options.inboundDay][options.outboundDay]
                    var id
                    // var
                    for (place in places){
                      if (places[place]["PlaceId"] == destinationName){
                        id = places[place]["SkyscannerCode"] + '-sky'
                        destinationName = places[place]['CityName']
                        break
                      }
                    }
                    finalDeals[options.inboundDay][options.outboundDay] = sortValues(prices, destinations, ids, destinationName, valuePrice, id)
                  }
                }
                counter++
                cb()
              })
            })
            req.on('error', function(e) {
              cb()
              counter++
            })
          }, options, function(){
            if (counter == ((SkyUECountries.length *  inbound.length * outbound.length) - 1)){
              for (var l = 0; l < finalDeals.length; l++){
                debug("\n\n\nNEW LOOP FOR FINAL DEALS", l)
                debug("FINAL DEALS", finalDeals[l])
              }
            }
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
