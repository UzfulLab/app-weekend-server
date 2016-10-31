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
    return {city: "Dublin", price: "42,42", deal: "http://google.fr", id: "f4k3id23123"}
  },
  updateDeal: function(id){
    // function to update a deal's price
    // call to skyscanner API and getting new price
    return {data:{newPrice: "142,21"}, status: 200}
  },
  createDeal: function(departureDay, departureMoment, returnDay, returnMoment, destinationCity, originCity, withPicture){
    //supposingly calling skyscanner API and choosing best deal
    var session = this.createSession()
    if (this.checkErrors(session))
      return {data: session, status: session.status}
    var tmpDeal = this.pollingSession(session)
    if (this.checkErrors(tmpDeal))
      return {data: session, status: session.status}

    // ONLY FOR DEV - SIMULATE SKYSCANNER API DOWN

    if (departureDay == "createError")
      return {data: {error: "Front created voluntarily an error to simulate skyscanner api down"}, status: 422}

    var deal = this.selectBestDeal(tmpDeal)
    if (!withPicture)
      return {data: deal, status: 200}
    var picture = imagesApi.findPhoto(destinationCity)
    var data = Object.assign(deal, {picture: picture})
    return {data: deal, status: 200}
  }
}
