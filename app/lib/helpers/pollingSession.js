var pollingSession = function(session, self){
  var departureMoments
  if (session.data.withMoment)
    departureMoments = ['M', 'A', 'E']
  else
    departureMoments = ['M;A;E']
  for (var i = 0; i < departureMoments.length; i++){
    for (var j = 0; j < departureMoments.length; j++){
      debug("WHAT IS ?", self)
      self.curlPollSession(session, departureMoments[i], departureMoments[j])
    }
  }
}

module.exports = pollingSession
