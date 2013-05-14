var connect = require('connect'),
    express = require('express'),
    stylus = require('stylus'),
    nib = require('nib'),
    login = require('../shared/login'),
//   RedisStore = require('connect-redis')(express),
    db = require("mysql").createClient({host:"localhost",user:"root",password:"mysqlr00t"}),
    db_project = require("mysql").createClient({host:"localhost",user:"root",password:"mysqlr00t"}),
    app = express();

app.configure(function () {
	app.set('view engine', 'jade');
	app.set('view options', {layout:false});

	app.use(express.favicon(__dirname + '/public/images/icon.gif'));
	//app.use(connect.compiler({ src: __dirname +'/public', enable: ['less']}));
	app.use(stylus.middleware({ src: __dirname + '/public', compile: compile }));
	app.use(express.static(__dirname +'/public'));
	app.use(express.cookieParser("s3cr3t"));
	app.use(express.session({secret:"s3cr3t"}));  // , store:new RedisStore
	app.use(express.bodyParser());
	app.use(express.query());

	//app.use(login(db, '/public', "fresheradmin"));

	db.useDatabase("fresheradmin", function (err) {
		if (err)
			throw "Couldn't find db";
		});


	function compile (str, path) {
		return stylus(str)
			.set('filename', path)
			.use(nib());
	};
});

app.configure('development', function() {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/logout', function(req, res) {
	req.session.user = null;
	res.writeHead(302, {'Location': '/'});
	res.end();
});


function runSQL(sql) {
	db_project.query(sql, function (err, results, fields) {
		
	});
}

app.get('/reset/:id', function(req, res) {



	/*
	db.query("SELECT * FROM Projects WHERE ID = "+ req.params.id,
		function (err, results, fields) {
			if (err)
				throw err;

			if (results.length) {
				res.render("reset", {project:results[0]});

				db_project.useDatabase(results[0].name, function (err) {
					if (err)
						throw err;



				});
			} else {
				throw "Project not found";
			}
		});
	*/
});

function renderMain(req, res) {
	db.query("SELECT * FROM Projects",
		function (err, results, fields) {
			if (err)
				throw err;

			if (results.length) {
				res.render("main", {projects:results});
			} else {
				throw "No projects found";
			}
		});
};

app.get('/', renderMain);
app.post('/', renderMain);
	
app.listen(3000);
console.log("\n\nFresher started...");