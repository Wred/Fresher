var connect = require('connect');
var express = require('express');
var login = require('../shared/login');
//var RedisStore = require('connect-redis')(express);
var db = require("mysql").createClient({host:"localhost",user:"root",password:"mysqlr00t"});
var app = express.createServer();

app.configure(function () {
	app.set('view engine', 'jade');
	app.set('view options', {layout:false});

	app.use(express.favicon());
	app.use(connect.compiler({ src: __dirname +'/public', enable: ['less']}));
	app.use(express.static(__dirname +'/public'));
	app.use(express.cookieParser("s3cr3t"));
	app.use(express.session({secret:"s3cr3t"}));  // , store:new RedisStore
	app.use(express.bodyParser());
	app.use(express.query());
	app.use(login(db, '/public'));
});

app.configure('development', function() {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/logout', function(req, res) {
	req.session.user = null;
	res.writeHead(302, {'Location': '/'});
	res.end();
});

function renderMain(req, res) {
	res.render("main");
};

app.get('/', renderMain);
app.post('/', renderMain);

	
app.listen(3000);
console.log("\n\nFresher started...");
