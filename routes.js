//Importing our controllers
var deals = require("./app/controllers/dealsController.js")

module.exports = function(router) {

	// middleware to use for all requests 
	// will be used for security check -- if bad infos ==> 401 unauthorized
	router.use(function(req, res, next) {
	    // do logging
	    console.log('Security check + limiter')
	    // console.log(helloWorld())
	    next() // make sure we go to the next routes and don't stop here
	})


	router.get('/', function(req, res) {
	    res.json({ message: 'API is Up !' })
	})

	router.get('/deals', function(req, res){
		res.json(deals.listDeals())
	})
}