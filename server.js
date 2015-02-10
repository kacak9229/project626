var express		= require('express');
var morgan 		= require('morgan');
var bodyParser 	= require('body-parser');
var path		= require('path');
var cors		= require('cors');
var mongoose	= require('mongoose');
var config		= require('./config');
// The instance of express object
var app			= express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(config.database, function(err) {
	if(err) {
		console.log("Error connecting to the database");
	} else {
		console.log("Connected to the database");
	}
});

app.use(express.static(__dirname + '/public'));

// The api routes;
var router = require('./app/routes/api');
app.use('/api', router);

app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/main.html'));
});

app.listen(config.port, function(err) {
	if(err) {
		console.log("There's an error connecting the app to port port 8080");
	} else {
		console.log("Listening on port " + config.port);
	}

});
