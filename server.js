// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 4242;        // set our port


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// loading our routes
require('./routes.js')(router);

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api/v0
app.use('/api/v0', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('API Ready on port ' + port);