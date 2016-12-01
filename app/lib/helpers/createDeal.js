var createDeal = function(departureDay, returnDay, destinationCity, passengers, cityFR, cityEN, destinationCountry, internalCall, withMoment, withPicture, departureMoment, returnMoment, originCity, res, self){
  debug("FUNCTION NAME ==> createDeal")
  // ONLY FOR DEV - SIMULATE SKYSCANNER API DOWN
  internalCall = internalCall || false
  if (departureDay == "createError")
    return {data: {error: "Front created voluntarily an error to simulate skyscanner api down"}, status: 422}
  self.createSession(departureDay, returnDay, destinationCity, passengers, cityFR, cityEN, destinationCountry, internalCall, withMoment, withPicture, departureMoment, returnMoment, originCity, res)
}

module.exports = createDeal
