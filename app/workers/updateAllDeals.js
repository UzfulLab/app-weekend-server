module.exports = {
  fetchDeals: function(){

    var http = require('http');
    var moment = require('moment');

    var inbound = [];
    var outbound = [];
    var momentDate;
    var quotes = [];
    var jsonString = [];
    var counter = 0
    // fetching infos about current day to know what date to choose for deals
    var today = {dayNumber: moment().day(), hour: moment().hour()};

    var Deal = require('../models/dealSchema.js');

    var findGoodDate = function(daysToAdd){
      var day = momentDate.date();
      var month = momentDate.month() + 1;
      var year = momentDate.year();
      if (String(day).length == 1) day = '0'+String(day);
      return year+'-'+month+'-'+day;
    }

    for (var i = 0; i < 3; i++){
      var nextWeek = (today.dayNumber >= (4 + i)) ? true : false;
      var nextWeekToAdd = nextWeek ? 7 : 0;
      var daysToAdd = (4 + i) - moment().day() + nextWeekToAdd;
      momentDate = moment().add(daysToAdd, 'day');
      inbound[i] = findGoodDate(daysToAdd);

      momentDate = momentDate.add(3, 'day');
      outbound[i] = findGoodDate(3);
    }

    // for (var i = 0; i < SkyUECountries.length; i++){
    for (var i = 0; i < 10; i++){
      jsonString[i] = '';
      //Second loop for inbound days
      for (var j = 0; j < inbound.length; j++){
        //Third loop for outbound days
        for (var k = 0; k < outbound.length; k++){

          var options = {
            hostname: 'partners.api.skyscanner.net',
            path: "/apiservices/browseroutes/v1.0/FR/EUR/fr-FR/PARI-sky/"+SkyUECountries[i]+"/"+inbound[j]+"/"+outbound[k]+"?apiKey="+SkyScannerApiKey
          }

          limiter.submit(function(options, cb){
            var req = http.get(options, function(res) {
              // debug('STATUS: ' + res.statusCode);
              // debug('HEADERS: ' + JSON.stringify(res.headers));

              // Buffer the body entirely for processing as a whole.
              var bodyChunks = "";
              res.on('data', function(chunk) {
                // You can process streamed parts here...
                bodyChunks += chunk.toString('utf-8');
              }).on('end', function() {
                // var body = Buffer.concat(bodyChunks);
                var body = bodyChunks
                // debug(body)
                var currentQuotes = JSON.parse(body)["Quotes"];
                // debug(body)
                // debug('BODY: ' + body);
                quotes.push(currentQuotes);

                var deal = new Deal();
                deal.id = counter
                deal.price = String(quotes[0].MinPrice)

                deal.save(function(err){
                  if (err)
                    debug("ERROR DEAL SAVE ==> "+err)

                  debug("DEAL SAVED ==> "+counter+'\n\n\n\n')
                  counter++
                  debug('RES.ON.END');
                  cb()
                })
              })
            });
            req.on('error', function(e) {
              debug('ERROR: ' + e.message + '\n' + counter);
              debug('FUNCTION ERROR');
              cb()
            });
          }, options, function(){
            debug("CALLBACK FUNCTION =========")
          })
        }
      }
    }
  }
}
