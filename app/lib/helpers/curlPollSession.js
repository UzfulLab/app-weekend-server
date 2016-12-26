//Function to poll a session so we can get deals infos and create it.

//verification functions
var deepLook = function(data){
  if (typeof(data.Itineraries) === "undefined"){
    //If so, it means that deal had a problem, we give this session a special
    //param meaning that we will create a generic deal for berlin instead.
    debug("_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-FINISH DEAL_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-")
    data.finishDeal = true
    return false
  }
  for (itinerary of data.Itineraries){
    if (itinerary.PricingOptions[0].DeeplinkUrl){
      //Choosing first deal with a link
      data.Itineraries[0] = itinerary
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
  return deepLook(data)
}

var curlPollSession = function(session, outboundMoment, inboundMoment, self){
  //Preparing get request
  var flag = false //if flag == true, a problem while polling the session occured
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
  //end of preparation

  //Get request into a limiter so we won't call too many times Skyscanner API
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
          //Sometimes, response is not a JSON, so to avoid the crash of our
          //API, we will poll again this session and catching the error
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
    //If a problem occured, polling session again

    //TODO mettre autres vérifications car peut tourner à l'infini
    if (flag)
      self.curlPollSession(session, options.outboundMoment, options.inboundMoment)
    else {
      error = error || ''
      //If deal is not empty, polling session again
      if (emptyCheck(data)){
        self.createDealFinalReturn({data, status: status, cityFR: session.data.cityFR, cityEN: session.data.cityEN, destinationCity: session.data.destinationCity,internalCall: session.data.internalCall, destinationCountry: session.data.destinationCountry, outboundMoment: options.outboundMoment, inboundMoment: options.inboundMoment, res: session.data.res})
      }
      //If fatal error, creating generic deal in berlin
      else if (data.finishDeal || session.data.attempts > 10){
        debug("GENRIC DEAL AFTER", session.data.attempts + " attemps")
        self.createSession(session.data.oldArgs[0], session.data.oldArgs[1], "BERL-sky", session.data.oldArgs[3], "Berlin", "Berlin", "DE-sky", session.data.oldArgs[7], session.data.oldArgs[8], session.data.oldArgs[9], options.outboundMoment, options.inboundMoment, session.data.oldArgs[12], session.data.oldArgs[13], session.data.oldArgs[14])
      }
      else{
        debug("4 - __________EMPTY__________", session.data.cityFR)
        flag = true
        if (status == 410 || new Date() - session.data.when > 180000){
          debug("\n\n\n\n!!!!!!!!!!!! ERROR: TIME OUT / URL IS DEAD -- CREATING NEW SESSION FOR - !!!!!!!!!!!!!",  session.data.destinationCountry, ' - ', session.data.cityFR)
          self.createSession(session.data.oldArgs[0], session.data.oldArgs[1], session.data.oldArgs[2], session.data.oldArgs[3], session.data.oldArgs[4], session.data.oldArgs[5], session.data.oldArgs[6], session.data.oldArgs[7], session.data.oldArgs[8], session.data.oldArgs[9], options.outboundMoment, options.inboundMoment, session.data.oldArgs[12], session.data.oldArgs[13], session.data.oldArgs[14])
        }
        else{
          debug("\n\n\n\n--------- EMPTY RESULTS FOR SESSION: PULLING SESSION AGAIN AFTER -----------", new Date() - session.data.when, " milli seconds for ", session.data.cityFR)
          self.curlPollSession(session, options.outboundMoment, options.inboundMoment)
        }
      }
    }
  })
}

module.exports = curlPollSession
