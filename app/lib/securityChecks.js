module.exports = {
  validAuthToken: function(authToken){
    //ofc we will need a true validation algorithm
    return authToken == "safetoken123"
  }
}
