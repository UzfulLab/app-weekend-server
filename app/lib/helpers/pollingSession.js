var pollingSession = function(session, self){
  var departureMoments
  var returnMoments

  // /!\ ajouter la condition ici pour voir si il y a un departureMoment /!\
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
      self.curlPollSession(session, departureMoments[i], returnMoments[j])
    }
  }
}

module.exports = pollingSession
