var express = require('express');
var login = require('./login');
var app = express.createServer();
//var RedisStore = require('connect-redis')(express);

app.configure(function () {
	app.set('view engine', 'jade');
	app.set('view options', {layout:false});
	app.use(express.favicon());
	app.use(express.cookieParser());
	app.use(express.session({secret:"s3cr3t"/*, store:new RedisStore */}));
	app.use(express.bodyParser());
	app.use(express.compiler({ src: __dirname + '/views/style', enable: ['less']}));
	app.use(express.query());
	app.use(login());
});

app.configure('development',function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/', function(req, res){
	res.send('Logged into Fresher...');
});

app.listen(3000);
console.log("\n\nFresher started...");
