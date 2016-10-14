//Importing lib functions
var status = require("./app/lib/statusHandler.js")
var securityChecks = require("./app/lib/securityChecks.js")

//Importing our controllers
var deals = require("./app/controllers/dealsController.js")

module.exports = function(router) {

	// middleware to use for all requests
	router.use(function(req, res, next) {
			//checking if a good authToken was sent in header during request.
			if (!securityChecks.validAuthToken(req.get("authToken"))){
				status.unauthorized(res)
			}
			//if so, calling good route
			else{
		    console.log('limiter function')
				next()
			}
	})

	// Routing
	router.get('/', function(req, res) {
		status.success(res, {toto: req.query.toto})
	})

	router.get('/deals', function(req, res){
		rep = deals.listDeals();
		status.autoStatus(res, rep)
	})

	router.post('/deal', function(req, res){
		rep = deals.customDeal(req.body.departureDay, req.body.departureMoment, req.body.returnDay, req.body.returnMoment, req.body.destinationCity, req.body.originCity, req.body.withPicture);
		status.autoStatus(res, rep)
	})

	// 404 route, should be kept at the end of routing
	router.get('*', function(req, res){
		status.notFound(res)
	})
}
