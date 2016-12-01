// var skyscannerApi = require("../js")

var emptyCheck = function(data){
  if (!data)
    return false
  if (!data.Itineraries)
    return false
  if (!data.Itineraries[0])
    return false
  if (!data.Itineraries[0].PricingOptions)
    return false
  if (!data.Itineraries[0].PricingOptions[0])
    return false
  if (!data.Itineraries[0].PricingOptions[0].DeeplinkUrl)
    return false
  return true
}

var curlPollSession = function(session, outboundMoment, inboundMoment, self){
  debug("FUNCTION NAME ==> curlPollSession")
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
    // debug("============OPTIONS============", options.outboundMoment)
    // debug("============OPTIONS============", options.inboundMoment)
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
          debug("\n\n\n====================================2 - FAT BUG===============================", err)
          flag = true
          // pollingSession(session)
          // cb({data: {body: "error while pulling deal"}}, 422, err, '', '')
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
    if (flag) this.curlPollSession(session, options.outboundMoment, options.inboundMoment)
    error = error || ''
    debug('3 - POLING STATUS', status)
    if (emptyCheck(data)){
      self.createDealFinalReturn({data, status: status, cityFR: session.data.cityFR, cityEN: session.data.cityEN, internalCall: session.data.internalCall, destinationCountry: session.data.destinationCountry, outboundMoment: options.outboundMoment, inboundMoment: options.inboundMoment, res: session.data.res})
    }
    else{
      debug("4 - __________EMPTY__________", session.data.cityFR)
      flag = true
      if (status == 410 || new Date() - session.data.when > 180000){
        debug("\n\n\n\n!!!!!!!!!!!! GOIGN BACK TO NEW SESSION !!!!!!!!!!!!!")
        self.createSession(session.data.oldArgs[0], session.data.oldArgs[1], session.data.oldArgs[2], session.data.oldArgs[3], session.data.oldArgs[4], session.data.oldArgs[5], session.data.oldArgs[6], session.data.oldArgs[7], session.data.oldArgs[8], session.data.oldArgs[9], session.data.oldArgs[10], session.data.oldArgs[11], session.data.oldArgs[12], session.data.oldArgs[13])
      }
      else{
        debug("OUTBOUNDMOMENT ====>", options.outboundMoment)
        debug("INBOUNDMOMENT ====>", options.inboundMoment)
        debug("\n\n\n\n--------- PULLING AGAIN -----------", session.data.cityFR)
        self.curlPollSession(session, options.outboundMoment, options.inboundMoment)
      }
    }
  })
}

module.exports = curlPollSession
