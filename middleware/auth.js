var model = require("../model");
var Session = model.session;
var User = model.user;
var auth = function(req, res, next) {
	var headers = req.headers;
	if (headers['x-auth-token']) {
		Session.find({
			where: {
				'token': headers['x-auth-token']
			}
		}).then(function(session) {
			try {
				session = session.get({
					plain: true
				});
				if (session.user_id) {
					User.find({
						id: session.user_id
					}).then(function(user) {
						try {
							user = user.get({
								plain: true
							})
							req.user = user;
							return next();
						} catch (e) {
							return next();
						}
					})
				} else {
					return next();
				}
			} catch (e) {
				return next();
			}
		})
	} else {
		return next();
	}
}

module.exports = auth;
