var express = require('express');
var login = require('login');
var app = express.createServer();

app.configure(function () {
	app.set('view engine', 'jade');
	app.set('view options', {layout:false});
	app.use(express.favicon());
	app.use(express.cookieParser());
	app.use(express.session({secret:"s3cr3t"}));
	app.use(express.bodyParser());
	//app.use(express.compiler({ src: __dirname + '/views/style', enable: ['less']});
	app.use(login.login());
});

app.configure('development',function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/', function(req, res){
	res.send('Andre...');
});

app.listen(3000);
console.log("Fresher started");
