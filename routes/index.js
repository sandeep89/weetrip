var express = require('express');
var router = express.Router();
var auth = require('../modules/auth');
/* GET home page. */
router.post('/sendotp', function(req, res, next) {
	var body = req.body;
	var mobile = body.mobile;
	auth.sendOTP(body.mobile, function(err, body) {
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
	})
});
router.post('/login', function(req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});

module.exports = router;
