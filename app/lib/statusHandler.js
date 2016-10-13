module.exports = {
  unauthorized: function(res){
    res
      .header("status", ["401"])
      .json({error: "Unauthorized, bad access token"})
  },
  success: function(res, data){
    res
      .header("status", ["200"])
      .json(data)
  }
}
