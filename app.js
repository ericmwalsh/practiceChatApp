var express = require("express");
var fs = require('fs');
var http = require('http');
var path = require('path');
var redis = require('redis');

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

//
var clients = [];
//Poll endpoint
app.get('/poll/*', function(req,res){
	clients.push(res);
});

//Msg endpoint
app.post('/msg', function(req, res){
	message = req.body;
	var msg = JSON.stringify(message);
	while(clients.length > 0){
		var client = clients.pop();
		client.end(msg);
	}
	res.end();
});

var credentials = {"host":"127.0.0.1", "port": 6379};

var subscriber = redis.createClient(credentials.port, credentials.host);
subscriber.on("error", function(err){
	console.error('There was an error with the subscriber redis client ' + err);
});
var publisher = redis.createClient(credentials.port, credentials.host);
publisher.on("error", function(err){
	console.error('There was an error with the publisher redis client ' + err);
});
if (credentials.password != ''){
	subscriber.auth(credentials.password);
	publisher.auth(credentials.password);
}

subscriber.on('message', function(channel, msg) {
	if(channel === 'chatter') {
		while(clients.length > 0) {
			var client = client.pop();
			client.end(msg);
		}
	}
});
subscriber.subscribe('chatter');