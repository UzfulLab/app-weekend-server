var imagesApi = require("../lib/imagesApi.js")

module.exports = {
  checkErrors: function(rep){
    //algorithm to check if no errors had been found
    return false //if no errors are found, return false
  },
  createSession: function(){
    var url //API call for creating session
    return url
  },
  pollingSession: function(session){
    var deals //API call for polling session
    return deals
  },
  selectBestDeal: function(deal){
    // algorithm to select best deal among skyscanner return
    return {city: "Dublin", price: "42.42", deal: "http://google.fr"}
  },
  createDeal: function(departureDay, departureMoment, returnDay, returnMoment, destinationCity, originCity, withPicture){
    //supposingly calling skyscanner API and choosing best deal
    var session = this.createSession()
    if (this.checkErrors(session))
      return {data: session, status: session.status}
    var tmpDeal = this.pollingSession(session)
    if (this.checkErrors(tmpDeal))
      return {data: session, status: session.status}
    var deal = this.selectBestDeal(tmpDeal)
    if (!withPicture)
      return {data: deal, status: 200}
    var picture = imagesApi.findPhoto(destinationCity)
    var data = Object.assign(deal, {picture: picture})
    return {data: deal, status: 200}
  }
}
