// var skyscannerApi = require("../js")

var deepLook = function(data){
  for (itinerary of data.Itineraries){
    if (itinerary.PricingOptions[0].DeeplinkUrl){
      data.Itineraries[0] = itinerary
      debug("====EMPTY CHECK RESOLVED !====")
      return true
    }
  }
  return false
}

var emptyCheck = function(data){
  if (!data){
    debug("\n\n\nEMPTY CHECK !!!!", "data")
    return false
  }
  if (!data.Itineraries){
    debug("\n\n\nEMPTY CHECK !!!!", "data.Itineraries")
    return false
  }
  if (!data.Itineraries[0]){
    debug("\n\n\nEMPTY CHECK !!!!", "data.Itineraries[0]")
    return false
  }
  if (!data.Itineraries[0].PricingOptions){
    debug("\n\n\nEMPTY CHECK !!!!", "data.Itineraries[0].PricingOptions")
    return false
  }
  if (!data.Itineraries[0].PricingOptions[0]){
    debug("\n\n\nEMPTY CHECK !!!!", "data.Itineraries[0].PricingOptions[0]")
    return false
  }
  if (!data.Itineraries[0].PricingOptions[0].DeeplinkUrl){
    debug("\n\n\nEMPTY CHECK !!!!", "data.Itineraries[0].PricingOptions[0].DeeplinkUrl")
    //function deep look
    // return false
    return deepLook(data)
  }
  return true
}

var curlPollSession = function(session, outboundMoment, inboundMoment, self){
  var flag = false
  var path = session.data.location.split("http://partners.api.skyscanner.net")[1]
  path += `&outbounddeparttime=${outboundMoment}`
  path += `&inbounddeparttime=${inboundMoment}`
  path += "&sortype=price"

  var options = {
    hostname: "partners.api.skyscanner.net",
    path: path,
    method: "GET",
    headers: {
      'Content-Type': "application/x-www-form-urlencoded"
    },
    outboundMoment: outboundMoment,
    inboundMoment: inboundMoment
  }

  limiterPollSession.submit(function(options, cb){
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
          body = JSON.parse(body)
        }
        catch(err){
          debug("\n\n\n====================================2 - JSON PARSE BUG===============================", err)
          flag = true
        }
        flag ? cb('', 422) : cb(body, status, "", options.outboundMoment, options.inboundMoment)
      })
    })

    req.on('error', (e) => {
      debug("REQUEST ",`problem with request: ${e.message}`);
      debug("CALLBACK CALLING ON ERROR")
      cb({data: {body: "error"}}, status, e.message, '', '')
    })

    req.end()

  }, options, (data, status, error, outboundMoment, inboundMoment) => {
    if (flag)
      self.curlPollSession(session, options.outboundMoment, options.inboundMoment)
    else {
      error = error || ''
      if (emptyCheck(data)){
        self.createDealFinalReturn({data, status: status, cityFR: session.data.cityFR, cityEN: session.data.cityEN, internalCall: session.data.internalCall, destinationCountry: session.data.destinationCountry, outboundMoment: options.outboundMoment, inboundMoment: options.inboundMoment, res: session.data.res})
      }
      else{
        debug("4 - __________EMPTY__________", session.data.cityFR)
        flag = true
        if (status == 410 || new Date() - session.data.when > 180000){
          debug("\n\n\n\n!!!!!!!!!!!! ERROR: TIME OUT / URL IS DEAD -- CREATING NEW SESSION... !!!!!!!!!!!!!")
          self.createSession(session.data.oldArgs[0], session.data.oldArgs[1], session.data.oldArgs[2], session.data.oldArgs[3], session.data.oldArgs[4], session.data.oldArgs[5], session.data.oldArgs[6], session.data.oldArgs[7], session.data.oldArgs[8], session.data.oldArgs[9], options.outboundMoment, options.inboundMoment, session.data.oldArgs[12], session.data.oldArgs[13])
        }
        else{
          debug("\n\n\n\n--------- EMPTY RESULTS FOR SESSION: PULLING SESSION AGAIN -----------", session.data.cityFR)
          self.curlPollSession(session, options.outboundMoment, options.inboundMoment)
        }
      }
    }
  })
}

module.exports = curlPollSession
