//Importing lib functions
var status = require("./app/lib/statusHandler.js")
var securityChecks = require("./app/lib/securityChecks.js")

//Importing our controllers
var deals = require("./app/controllers/dealsController.js")
var Deal = require('./app/models/dealSchema.js')
var dealWorker = require('./app/workers/updateAllDeals.js')

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
		deals.listDeals();
	})

	router.post('/deals', function(req, res){
		var dropDB = req.body.dropDB || false
		if (typeof(dropDB) !== 'undefined') dropDB = JSON.parse(dropDB)
		var databaseMessage = "Database was not dropped"
		var statusCode = 200
		dealWorker.fetchDeals()
		if (dropDB){
			databaseMessage = "Database was dropped"
			Deal.remove({}, function(err){
				if (!err)
					databaseMessage = "Database was dropped"
				else{
					databaseMessage = "ERROR while dropping database"
					statusCode = 422
				}
			})
		}
		status.autoStatus(res, {status: statusCode, data: {message: "Deals are updating now", database: databaseMessage}})
	})

	router.post('/deal', function(req, res){
		deals.customDeal(req.body.departureDay, req.body.returnDay, req.body.destinationCity, req.body.passengers, req.body.cityFR, req.body.cityEN, req.body.destinationCountry, false, req.body.withMoment, req.body.withPicture, req.body.departureMoment, req.body.returnMoment, req.body.originCity)
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
