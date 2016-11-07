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

    //function to find if inbound/outbound date is on current week or next week
    var findGoodDate = function(){
      var day = momentDate.date()
      var month = momentDate.month() + 1
      var year = momentDate.year()
      if (String(day).length == 1) day = '0'+String(day)
      return year+'-'+month+'-'+day
    }

    //function to sort deals and give the 3 bests
    var sortValues = function(prices, destinations, ids, destinationName, valuePrice, id){
      //adding new deal to infos arrays
      prices.push(valuePrice)
      destinations.push(destinationName)
      ids.push(id)

      //creating deal array
      var destPric = []
      for (var l = 0; l < prices.length; l++){
        destPric.push({dest: destinations[l], price: prices[l], id: ids[l]})
      }

      //sorting our deals array
      destPric.sort(function(a, b){
        return (a.price - b.price)
      })

      //sorting our infos array
      for (var l = 0; l < destPric.length; l++){
        prices[l] = destPric[l].price
        destinations[l] = destPric[l].dest
        ids[l] = destPric[l].id
      }

      //keeping only deals that we need
      while (destPric.length > TOTALDEALS)
        destPric.pop()
      while (prices.length > TOTALDEALS)
        prices.pop()
      while (destinations.length > TOTALDEALS)
        destinations.pop()
      while (ids.length > TOTALDEALS)
        ids.pop()

      return destPric
    }

    //finding travel dates (current or next week) depending on current date
    for (var i = 0; i < 3; i++){
      //4 corresponds to thursday because it's first day of departure
      var nextWeek = (today.dayNumber >= (4 + i)) ? true : false;
      //If we already are thursday + i day, then we need departure to be on next week
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

    //creating here our arrays because of asynchronous
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

          //conserving j and k into options because of asynchronous
          //setting our get request to fetch best prices for destinations
          var options = {
            hostname: 'partners.api.skyscanner.net',
            path: "/apiservices/browseroutes/v1.0/FR/EUR/fr-FR/PARI-sky/"+SkyUECountries[i]+"/"+inbound[j]+"/"+outbound[j][k]+"?apiKey="+SkyScannerApiKey,
            inboundDay: j,
            outboundDay: k
          }

          //lunching our request through a limiter so we don't get banned by Skyscanner
          limiter.submit(function(options, cb){
            var req = http.get(options, function(res) {
              var body = ""
              //response is too long so we need to concatenate it
              res.on('data', function(chunk) {
                body += chunk.toString('utf-8')
              })
              res.on('end', function() {
                //when request is over, we get useful informations
                var currentQuotes = JSON.parse(body)["Quotes"]
                var places = JSON.parse(body)["Places"]
                //If skyscanner gave us quotes, we can proceed
                //Sorting the quotes by price
                if (currentQuotes.length > 0){
                  currentQuotes.sort(function(a,b){
                    return a.MinPrice - b.MinPrice
                  })
                  //If the request gave us imperative infos, we can proceed
                  if (typeof(currentQuotes[0].OutboundLeg) !== "undefined" && typeof(currentQuotes[0].OutboundLeg.DestinationId) !== "undefined"){
                    //Setting variables for sorting algorithm
                    var prices = bestDeals.prices[options.inboundDay][options.outboundDay]
                    var destinations = bestDeals.destinations[options.inboundDay][options.outboundDay]
                    var destinationName = currentQuotes[0].OutboundLeg.DestinationId
                    var valuePrice = currentQuotes[0].MinPrice
                    var ids = bestDeals.ids[options.inboundDay][options.outboundDay]
                    var id
                    for (place in places){
                      if (places[place]["PlaceId"] == destinationName){
                        id = places[place]["SkyscannerCode"] + '-sky'
                        destinationName = places[place]['CityName']
                        break
                      }
                    }
                    //Sorting algorithm
                    finalDeals[options.inboundDay][options.outboundDay] = sortValues(prices, destinations, ids, destinationName, valuePrice, id)
                  }
                }
                //our counter to know how many request were sent
                counter++
                //callback function of limiter
                cb()
              })
            })
            //If get request responded with an error
            req.on('error', function(e) {
              //our counter to know how many request were sent
              counter++
              //callback function of limiter
              cb()
            })
          }, options, function(){
            //Limiter callback
            //We calculate if all requests to skyscanner have been done
            if (counter == ((SkyUECountries.length *  inbound.length * outbound.length) - 1)){
              //Then we send requests to skyscanner to get a link to deal
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
