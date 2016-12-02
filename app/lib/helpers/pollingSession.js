//Function to prepare the polling(s) of a session
var pollingSession = function(session, self){
  var departureMoments
  var returnMoments

  //Checking if a specific moment is requested, all moments or none
  if (session.data.departureMoment){
    departureMoments = [session.data.departureMoment]
    returnMoments = [session.data.returnMoment]
  }
  else if (session.data.withMoment){
    departureMoments = ['M', 'A', 'E']
    returnMoments = ['M', 'A', 'E']
  }
  else{
    departureMoments = ['M;A;E']
    returnMoments = ['M;A;E']
  }
  for (var i = 0; i < departureMoments.length; i++){
    for (var j = 0; j < departureMoments.length; j++){
      //Pulling session for a specific moment (all moments is a specific moment)
      self.curlPollSession(session, departureMoments[i], returnMoments[j])
    }
  }
}

module.exports = pollingSession
