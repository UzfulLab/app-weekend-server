// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var cors = require('cors');
var config = require('./config.js')

var fetchAllDeals = require('./app/workers/updateAllDeals.js')

// var j = schedule.scheduleJob('01 * * * * *', function(){
//   fetchAllDeals.fetchDeals();
// });
// fetchAllDeals.fetchDeals()
// Database setup
//Will need to be changed when in production

// ====== Cors module config - Fix to accept request from localhost,
// seems to only be needed when developing from localhost in the front, and not useful when app is deploy as an extension
// probably needs improvements when production deployment =====
var whitelist = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://0.0.0.1:3000',
];
var corsOptions = {
    origin: function(origin, callback){
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
};
app.use(cors(corsOptions));
// ====== End cors module config

var time = new Date();

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
console.log(time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + ' API Ready on port ' + port);
