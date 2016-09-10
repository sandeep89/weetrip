/**
 * Module to perform all the onboarding and authentication feactures
 */

var auth = module.exports;
var expressRequest = require('express-request-wrapper');
var model = require('../model');
var User = model.user;
var Session = model.session;
var crypto = require('crypto');

auth.sendOTP = function(mobileNumber, cb, name, email) {
	if (!mobileNumber) return cb(new Error("Mobile number not specified"));

	var username = process.config.valueFirst.username;
	var password = process.config.valueFirst.password;
	var otp = Math.floor(100000 + Math.random() * 900000);
	var data = 'data=%3C%3Fxml+version%3D%221.0%22+encoding%3D%22ISO-8859-1%22%3F%3E%0D%0A%3C%21DOCTYPE+MESSAGE+SYSTEM+%22http%3A%2F%2F127.0.0.1%3A80%2Fpsms%2Fdtd%2Fmessagev12.dtd%22%3E%0D%0A%3CMESSAGE+VER%3D%221.2%22%3E%0D%0A%3CUSER+USERNAME%3D%22' +
		username + '%22+PASSWORD%3D%22' +
		password + '%22%2F%3E%0D%0A%3CSMS++UDH%3D%220%22+CODING%3D%221%22+TEXT%3D%22%22+PROPERTY%3D%220%22+ID%3D%221%22%3E%0D%0A%3CADDRESS+FROM%3D%22%22+TO%3D%22%22+SEQ%3D%221%22+TAG%3D%22some+clientside+random+data%22%2F%3E%0D%0A%3C%2FSMS%3E%0D%0A%3CSMS+UDH%3D%220%22+CODING%3D%221%22+TEXT%3D%22Weetrip+mobile+verification+code+-+' +
		otp + '%22+PROPERTY%3D%220%22+ID%3D%222%22%3E%0D%0A%3CADDRESS+FROM%3D%22practo%22+TO%3D%22%2B91' +
		mobileNumber + '%22+SEQ%3D%221%22+TAG%3D%22%22+%2F%3E%0D%0A%3C%2FSMS%3E%0D%0A%3C%2FMESSAGE%3E&action=send';

	User.findOrCreate({
		where: {
			mobile: mobileNumber
		},
		defaults: {
			mobile: mobileNumber,
			name: name,
			email: email
		}
	}).spread(function(user) {
		try {
			var user = user.get({
				plain: true
			});
			Session.create({
				user_id: user.id,
				otp: otp,
				mobile: mobileNumber
			}).then(function(session) {
				var header = {
					"Content-Type": "application/x-www-form-urlencoded"
				};
				var url = 'http://api.myvaluefirst.com/psms/servlet/psms.Eservice2';
				expressRequest.makePostCall(url, data, header,
					function(err, body, response) {
						if (err) {
							return cb(err);
						}
						return cb(null, body);
					}, true)
			})
		} catch (e) {
			console.log(e);
			return cb(new Error("Unable to find user"));
		}
	});
}

auth.loginUser = function(mobileNumber, otp, cb) {
	Session.find({
		where: {
			otp: otp,
			mobile: mobileNumber
		}
	}).then(function(session) {
		try {
			var session = session.get({
				plain: true
			})
			if (session.user_id) {
				var current_date = (new Date()).valueOf().toString();
				var random = Math.random().toString();
				session.token = crypto.createHash('sha1').update(current_date + random).digest('hex');
				Session.update(session, {
					where: {
						otp: otp,
						mobile: mobileNumber
					}
				}).spread(function(count) {
					User.find({
						where: {
							id: session.user_id
						}
					}).then(function(user) {
						var user = user.get({
							plain: true
						})
						if (!user.verified) {
							User.update({
								vrified: true
							}, {
								where: {
									id: user.id
								}
							}).spread(function(count) {
								user.verified = true;
								user.token = session.token;
								return cb(null, user);
							})
						}
					})
				})
			}
		} catch (e) {
			// statements
			console.log(e);
		}
	})
}
