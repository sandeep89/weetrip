var express = require('express');
var router = express.Router();
var tripModule = require('../modules/trip');

/* GET users listing. */
router.post('/create', function(req, res, next) {
	if (!req.user) return next(new Error('User not preset in the session'));
	tripModule.createTrip(req.user, req.body,
		function(err, trip) {
			if (err) return next(err);

			return res.send({
				trip: trip
			});
		});
});

module.exports = router;
