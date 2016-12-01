var skyscannerAPI = require("../lib/skyscannerApi.js")

module.exports = {
  fetchDeals: function(){

    var http = require('http')
    var moment = require('moment')

    var inbound = []
    var outbound = []
    var momentDate
    var finalDeals = []
    var ids = []
    var countries = []
    var counter = 0
    var bestDeals = {prices: [], destinations: [], ids: [], countries: []}

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
    var sortValues = function(prices, destinations, ids, countries, destinationName, valuePrice, id, country){
      //adding new deal to infos arrays
      prices.push(valuePrice)
      destinations.push(destinationName)
      ids.push(id)
      countries.push(country)

      //creating deal array
      var destPric = []
      for (var l = 0; l < prices.length; l++){
        destPric.push({dest: destinations[l], price: prices[l], id: ids[l], country: countries[l]})
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
        countries[l] = destPric[l].country
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
      while (countries.length > TOTALDEALS)
        countries.pop()

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
      outbound[i] = findGoodDate()

      inbound[i] = []
      momentDate = momentDate.add(7 - 1 - momentDate.day(), 'day')
      //minus one corresponds to the first momentDate.add(1, 'day') on the for loop
      for (var j = 0; j < 3; j++){
        momentDate = momentDate.add(1, 'day')
        inbound[i][j] = findGoodDate()
      }
    }

    //creating here our arrays because of asynchronous
    for (var i = 0; i < outbound.length; i++){
      bestDeals.prices[i] = []
      bestDeals.destinations[i] = []
      bestDeals.ids[i] = []
      bestDeals.countries[i] = []
      finalDeals[i] = []
      for (var j = 0; j < inbound.length; j++){
        bestDeals.prices[i][j] = []
        bestDeals.destinations[i][j] = []
        bestDeals.ids[i][j] = []
        bestDeals.countries[i][j] = []
        finalDeals[i][j] = []
      }
    }

    debug("WORKER", "Lunching deal seaking")
    //First loop for all destinations
    for (var i = 0; i < SkyUECountries.length; i++){
      //Second loop for inbound days
      for (var j = 0; j < outbound.length; j++){
        //Third loop for outbound days
        for (var k = 0; k < inbound.length; k++){

          //conserving j and k into options because of asynchronous
          //setting our get request to fetch best prices for destinations
          var options = {
            hostname: 'partners.api.skyscanner.net',
            path: "/apiservices/browseroutes/v1.0/FR/EUR/fr-FR/PARI-sky/"+SkyUECountries[i]+"/"+outbound[j]+"/"+inbound[j][k]+"?apiKey="+SkyScannerApiKey,
            outboundDay: j,
            inboundDay: k,
            skyEuCountry: SkyUECountries[i]
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
                    var prices = bestDeals.prices[options.outboundDay][options.inboundDay]
                    var destinations = bestDeals.destinations[options.outboundDay][options.inboundDay]
                    var destinationName = currentQuotes[0].OutboundLeg.DestinationId
                    var valuePrice = currentQuotes[0].MinPrice
                    var ids = bestDeals.ids[options.outboundDay][options.inboundDay]
                    var countries = bestDeals.countries[options.outboundDay][options.inboundDay]
                    var country = options.skyEuCountry
                    var id
                    for (place in places){
                      if (places[place]["PlaceId"] == destinationName){
                        id = places[place]["SkyscannerCode"] + '-sky'
                        destinationName = places[place]['CityName']
                        break
                      }
                    }
                    //Sorting algorithm
                    finalDeals[options.outboundDay][options.inboundDay] = sortValues(prices, destinations, ids, countries, destinationName, valuePrice, id, country)
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
              debug("==================ERROR ON SEEKING===================  -  ", options.skyEuCountry)
              //callback function of limiter
              cb()
            })
          }, options, function(){
            //Limiter callback
            //We calculate if all requests to skyscanner have been done
            debug("CALLBACK", counter)
            if (counter == ((SkyUECountries.length *  inbound.length * outbound.length) - 1)){
              //Then we send requests to skyscanner to get a link to deal
              for (var i = 0; i < finalDeals.length; i++){
                debug("\n\n\nNEW LOOP FOR FINAL DEALS", i)
                debug("FINAL DEALS", finalDeals[i])
                //Second loop for inbound days
                for (var j = 0; j < outbound.length; j++){
                  //Third loop for outbound days
                  for (var k = 0; k < inbound.length; k++){
                    //Fourth loop for number of passengers
                    for (var l = 1; l <= MAXPASSENGERS; l++){

                      var departureDay = outbound[j]
                      var returnDay = inbound[j][k]
                      var destinationCity =
                        finalDeals[i][j][k] ? finalDeals[i][j][k].id : "BERL-sky"
                      var skyCountry =
                        finalDeals[i][j][k] ? finalDeals[i][j][k].country : "DE-sky"
                      var passengers = l
                      var cityFR =
                        finalDeals[i][j][k] ? finalDeals[i][j][k].dest : "Berlin"
                      var cityEN =
                        finalDeals[i][j][k] ? finalDeals[i][j][k].dest : "Berlin"
                      var internalCall = true
                      var withMoment = true
                      var withPicture = true

                      skyscannerAPI.createDeal(
                        departureDay,
                        returnDay,
                        destinationCity,
                        passengers,
                        cityFR,
                        cityEN,
                        skyCountry,
                        internalCall,
                        withMoment,
                        withPicture
                      )
                    }
                  }
                }
              }
            }
          })
        }
      }
    }
  }
}
