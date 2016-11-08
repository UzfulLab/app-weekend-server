//Importing lib functions
var status = require("./app/lib/statusHandler.js")
var securityChecks = require("./app/lib/securityChecks.js")

//Importing our controllers
var deals = require("./app/controllers/dealsController.js")

module.exports = function(router) {

	// middleware to use for all requests
	router.use(function(req, res, next) {
			response = res
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
		status.success(res, {message: "API is up !"})
	})

	router.get('/deals', function(req, res){
		rep = deals.listDeals();
		status.autoStatus(res, rep)
	})

	router.post('/deal', function(req, res){
		//(departureDay, returnDay, destinationCity, passengers, withPicture, departureMoment, returnMoment, originCity)
		deals.customDeal(req.body.departureDay, req.body.returnDay, req.body.destinationCity, req.body.passengers, req.body.withPicture, req.body.departureMoment, req.body.returnMoment, req.body.originCity)
		// rep = deals.customDeal(req.body.departureDay, req.body.returnDay, req.body.destinationCity, req.body.passengers, req.body.withPicture, req.body.departureMoment, req.body.returnMoment, req.body.originCity);
		// status.autoStatus(res, rep)
	})

	router.put('/deal/:id', function(req, res){
		console.log(req.params.id)
		rep = deals.updateDeal(req.params.id)
		status.autoStatus(res, rep)
	})

	// 404 route, should be kept at the end of routing
	router.get('*', function(req, res){
		status.notFound(res)
	})
}
