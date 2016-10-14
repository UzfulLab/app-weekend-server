var flickrApi = require('./flickrApi.js')
var unsplashApi = require('./unsplashApi.js')
var default_photo = "https://hd.unsplash.com/photo-1446770145316-10a05382c470"

module.exports = {
  checkEmpty: function(rep){
    //checks if images search was empty. If empty returns true
    return false
  },
  findPhoto: function(city){
    var unsplashPhotos = unsplashApi.findPhotos(city)
    if (!unsplashApi.checkErrors(unsplashPhotos) && !this.checkEmpty(unsplashPhotos))
      return unsplashApi.selectPhoto(unsplashPhotos)
    var flickrPhotos = flickrApi.findPhotos(city)
    if (!flickrApi.checkErrors(flickrPhotos) && !this.checkEmpty(flickrPhotos))
      return flickrApi.selectPhoto(flickrPhotos)
    return default_photo //
  }
}
