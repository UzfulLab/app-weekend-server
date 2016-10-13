//Importing lib functions
var status = require("./app/lib/statusHandler.js")
var securityChecks = require("./app/lib/securityChecks.js")

//Importing our controllers
var deals = require("./app/controllers/dealsController.js")

module.exports = function(router) {

	// middleware to use for all requests
	router.use(function(req, res, next) {
	    console.log('Security check + limiter')
			//checking if a good authToken was sent in header during request.
			if (!securityChecks.validAuthToken(req.get("authToken"))){
				status.unauthorized(res)
			}
			//if so, calling good route
			else{
				next()
			}
	})

	// Actual routing
	router.get('/', function(req, res) {
			status.success(res, {toto: req.query.toto})
	})

	router.get('/deals', function(req, res){
		//TODO decide of a format for response like
		// var rep = deals.listDeals();
		// status.autoStatus(rep, res)
		// Adding a new method to status called autoStatus and checking rep.status number
		// autoStatus should also return rep.data 
		res.json(deals.listDeals())
	})
}
