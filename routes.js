//Importing our controllers
var deals = require("./app/controllers/dealsController.js")
var status = require("./app/lib/statusHandler.js")
var securityChecks = require("./app/lib/securityChecks.js")

module.exports = function(router) {

	// middleware to use for all requests
	// will be used for security check -- if bad infos ==> 401 unauthorized
	router.use(function(req, res, next) {
	    console.log('Security check + limiter')
			if (!securityChecks.validAuthToken(req.get("authToken"))){
				status.unauthorized(res)
			}
			else{
	    	next() // make sure we go to the next routes and don't stop here
			}
	})

	// Actual routing
	router.get('/', function(req, res) {
			status.success(res, {toto: req.query.toto})
	})

	router.get('/deals', function(req, res){
		res.json(deals.listDeals())
	})
}
