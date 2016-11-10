//Importing lib functions
var status = require("./app/lib/statusHandler.js")
var securityChecks = require("./app/lib/securityChecks.js")

//Importing our controllers
var deals = require("./app/controllers/dealsController.js")
var Deal = require('./app/models/dealSchema.js')

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

	router.get('/testModel', function(req, res){
		inbound = new Date(Date.parse("2016-11-13T00:00:00Z"))
		outbound = new Date(Date.parse("2016-11-10T00:00:00Z"))
		// Deal.find().byDates(outbound, inbound).exec(function(err, deals){
		// 	debug("!!!!! DEALS !!!!!", deals)
		// 	debug("!!!!! ERROR !!!!!", err)
		// })
		// Deal.find().byOutBoundThursday().exec(function(err, deals){
		// 	debug("!!!!! DEALS !!!!!", deals)
		// 	debug("!!!!! ERROR !!!!!", err)
		// 	deals.byInboundSunday().exec(function(err, deals){
		// 		debug("\n\n\n!!!!! DEALS BIS!!!!!", deals)
		// 		debug("!!!!! ERROR BIS!!!!!", err)
		// 	})
		// })
		//TODO CHAIN QUERIES !
		Deal.find().byFriMon().exec(function(err, deals){
				debug("!!!!! DEALS !!!!!", deals)
				debug("!!!!! ERROR !!!!!", err)
				debug("===TYPEOF===", typeof(Deal))
				status.success(res, {data: deals})
		})

		// var cursor = Deal.find().byFriMon().cursor()
		// cursor.on('data', function(doc){
		// 	debug("\nDATA", doc)
		// })
		// cursor.on('close', function(){
		// 	debug("\nC FINI")
		// 	status.success(res, {message: "HEllo WOrld"})
		// })

		// status.success(res, {message: Deal.fetchDealsByDate})
	})

	router.get('/deals', function(req, res){
		rep = deals.listDeals();
		status.autoStatus(res, rep)
	})

	router.post('/deal', function(req, res){
		deals.customDeal(req.body.departureDay, req.body.returnDay, req.body.destinationCity, req.body.passengers, req.body.cityFR, req.body.cityEN, req.body.destinationCountry, false, req.body.withPicture, req.body.departureMoment, req.body.returnMoment, req.body.originCity)
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
