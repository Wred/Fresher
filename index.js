var express = require('express');
var app = express.createServer(
	express.cookieParser()
);

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/', function(req, res){
	res.send('Awesome...');
});

app.listen(3000);
