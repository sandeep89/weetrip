var express = require('express');
var router = express.Router();
var auth = require('../modules/auth');
/* GET home page. */
router.post('/sendotp', function(req, res, next) {
	var body = req.body;
	var mobile = body.mobile;
	auth.sendOTP(mobile, function(err, body) {
		if (err) {
			return {
				failure: true
			}
		} else {
			res.send({
				success: true,
				message: "OTP sent to mobile number +91" + mobile
			})
		}
	},body.name, body.email)
});
router.post('/login', function(req, res, next) {
	var body = req.body;
	var mobile = req.body.mobile;
	var otp = req.body.otp;
	auth.loginUser(mobile, otp, function(err, user) {
		if (err) {
			return {
				failure: true
			}
		} else {
			res.send({
				user: user
			});
		}
	})
});

module.exports = router;
