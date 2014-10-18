var MysqlClient = require("mysql").Client, db = new MysqlClient();
//var util = require("util");

db.user = "root";
db.password = "mysqlr00t";

exports = module.exports = function login() {
	return function login(req, res, next) {
		if (req.session.token != null) {
			next();
		} 
		else if (req.query.project) {
			db.database = req.query.project;
			
			db.connect(function (err) {
				if (err) {
					res.render("login",
						{error:{id:1,msg:"Invalid project"},
						query:req.query});
				} else {
					db.query("SELECT ID FROM Users WHERE"+
						" username = '"+ req.query.user +"'"+
						" AND password = '" + req.query.password +"'",
						function (err, results, fields) {
							if (results.length) {
								req.session.token = "working!"
								next();
							}
							else {
								res.render("login",
									{error:{id:3,msg:"Invalid username or password"},
									query:req.query});
							}
						}
					);
				}
			})
		}
		else {
			res.render("login",
				{error:{id:0,msg:null},
				query:req.query});
		}
	}
}
