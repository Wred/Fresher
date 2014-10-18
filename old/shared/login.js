var url = require("url");
var crypto = require('crypto');

function hex_md5(str) {
	return crypto.createHash("md5").update(str).digest("hex");
}

function renderLogin(req, res, err) {
	// generate random 32-bit int
	req.session.salt = Math.floor(Math.random()*0x100000000);
	res.render("login",
		{error:err,
		query:req.query,
		salt:req.session.salt});
}

exports = module.exports = function login(db, passthrough, fixedProject) {
	return function login(req, res, next) {
		if (url.parse(req.url).pathname.indexOf(passthrough) == 0) {
			next()
		} else {
			if (req.session.user) {
				// already logged in
				next();
			} 
			else if (req.body.project || (fixedProject && req.body.user)) {
				var project = (typeof fixedProject !== 'undefined') ? fixedProject : req.body.project;

				db.useDatabase(project, function (err) {
					if (err)
						renderLogin(req, res, {id:1,msg:"Invalid project"});
					else
						db.query("SELECT ID, username, password FROM Users WHERE"+
							" username = '"+ req.body.user +"'",
							function (err, results, fields) {
								if (err)
									throw err;

								if (results.length) {
									// combine hashed pword and salt then hash it
									var hash = hex_md5(hex_md5(results[0].password) + String(req.session.salt));

									if (hash == req.body.password) {
										console.log("user logged in: "+ req.body.user);
										req.session.user = {username:req.body.user};

										// need to redirect here
										res.writeHead(302, {'Location': req.url});
										res.end();
									} else
										renderLogin(req, res, {id:4,msg:"Invalid password"});
								}
								else 
									renderLogin(req, res, {id:3,msg:"Invalid username"});
							}
						);
				});
			}
			else
				renderLogin(req, res, {id:0,msg:null});
		}
	}
}
