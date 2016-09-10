var express = require('express');
var router = express.Router();
var tripModule = require('../modules/trip');

router.use(function(req, res, next) {
		if (!req.user) return next(new Error('User not preset in the session'));
		next();
	})
	/* GET users listing. */
router.post('/create', function(req, res, next) {
	tripModule.createTrip(req.user, req.body,
		function(err, trip) {
			if (err) return next(err);

			return res.send({
				trip: trip
			});
		});
});

router.get('/list', function(req, res, next) {
	tripModule.getTrips(req.user, function(err, trips) {
		if (err) return next(err);

		return res.send({
			trips: trips
		});
	})
})

router.post('/addUser', function(req, res, next) {
	tripModule.addUser(req.user, req.body, function(err, trip) {
		if (err) return next(err);

		return res.send({
			trip: trip
		});
	})
})

router.get('/invites', function(req, res, next) {
	tripModule.getInvites(req.user, function(err, trips) {
		if (err) return next(err);

		return res.send({
			trips: trips
		});
	})
})

router.post('/removeUser', function(req, res, next) {
	tripModule.removeUser(req.user, function(err, trip) {
		return res.send({
			trip: trip
		})
	})
})

router.post('/acceptInvite', function(req, res, next) {
	/* body... */
})
module.exports = router;
