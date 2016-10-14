module.exports = {
  checkErrors: function(rep){
    //algorithm to check if no errors had been found
    return false //if no errors are found, return false
  },
  findPhotos: function(city){
    //would normally make calls to flickr API to find photos
    return {
      photoOne: "https://images.unsplash.com/photo-1476158085676-e67f57ed9ed7?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&s=3b921acce5c55d802d64d31d081e80bb",
      photoTwo: "https://images.unsplash.com/photo-1476158085676-e67f57ed9ed7?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&s=3b921acce5c55d802d64d31d081e80bb"
    }
  },
  selectPhoto: function(photos){
    // would normally sort photos
    return photos.photoOne
  }
}
