exports = module.exports = function login() {
	return function login(req, res, next) {
		if (req.session.token != null) {
			next();
		}
		else if (req.query.user) {
			if ((req.query.user == "test") && (req.query.password == "test")) {
				req.session.token = "working!"
				next();
			}
			else {
				res.render("login",
					{error:{id:1,msg:"Invalid username or password"},
					query:req.query});
			}
		}
		else {
			res.render("login",
				{error:{id:0,msg:null},
				query:req.query});
		}
	}
}
