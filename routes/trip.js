var express = require('express');
var router = express.Router();
var tripModule = require('../modules/trip');
var async = require('async');
var fs = require('fs');

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

router.get('/getTrip', function(req, res, next) {
	console.log(req.query, req.params);
	tripModule.getTrip(req.query, function(err, trip) {
		if (err) return next(err)

		return res.send({
			trip: trip
		})
	})
})
router.post('/adduser', function(req, res, next) {
	tripModule.addUser(req.body.trip, req.body.users,
		function(err, trip) {
			if (err) return next(err);

			return res.send({
				trip: trip
			});
		})
})

router.post('/uploadfile', function(req, res, next) {
	if (req.files && req.body.trip) {
		tripModule.uploadFiles(req.user, req.files, req.body,
			function(err, file) {
				if (err) {
					return next(err);
				} else {
					return res.send({
						file: file
					})
				}
			})
	} else {
		next(new Error("No photo file found"))
	}
})

router.post('/addtag', function(req, res, next) {
	tripModule.addTag(req.user, req.body,
		function(err, tag) {
			if (err) {
				return next(err)
			} else {
				return res.send({
					tag: tag
				})
			}
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

router.post('/removeuser', function(req, res, next) {
	tripModule.removeUser(req.user, function(err, trip) {
		return res.send({
			trip: trip
		})
	})
})

router.post('/acceptinvite', function(req, res, next) {
	/* body... */
})
module.exports = router;
