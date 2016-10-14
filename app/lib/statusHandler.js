module.exports = {
  success: function(res, data){
    res
      .header("status", ["200"])
      .json(data)
  },
  unauthorized: function(res){
    res
      .header("status", ["401"])
      .json({error: "Unauthorized, bad access token"})
  },
  notFound: function(res){
    res
      .header("status", ["404"])
      .json({error: "Route not found"})
  },
  unprocessable: function(res, data){
    res
      .header("status", ["422"])
      .json({error: "Unprocessable Entity"})
  },  
  fatalError: function(res){
    res
      .header("status", ["500"])
      .json({error: "Internal server error"})
  },
  autoStatus: function(res, rep){
    switch (rep.status){
      case 200:
        this.success(res, rep.data)
        break
      case 401:
        this.unauthorized(res)
        break
      case 422:
        this.unprocessable(res)
        break
      case 500:
        this.fatalError(res)
        break
      default:
        this.fatalError(res)
    }
  }
}
