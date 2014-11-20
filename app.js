var express = require("express");
var fs = require('fs');
var http = require('http');
var path = require('path');

var app = express();
app.set('port', 3000);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

//Serve up our static resources
app.get('/', function(req, res) {
	fs.readFile('./public/index.html', function(err, data) {
		res.end(data);
	});
});

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});