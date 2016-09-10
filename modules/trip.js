/**
 * Module to perform trip related activities
 */

var model = require("../model");
var Trip = model.trip;
var tripModule = module.exports;

tripModule.createTrip = function(user, body, cb) {
	body.created_by = user.id;
	Trip.findOrCreate({
		where: {
			name: body.name,
			created_by: user.id
		},
		defaults: body
	}).spread(function(trip) {
		try {
			trip = trip.get({
				plan: true
			});
			return cb(null, trip);
		} catch (e) {
			return cb(e);
		}
	})
}

tripModule.getTrips = function(user, cb) {
	Trip.findAll({
		where: {
			created_by: user.id
		}
	}).then(function(trips) {
		try {
			var plainTrips = [];
			trips.forEach(
				function(trip) {
					plainTrips.push(trip.get({
						plain: true
					}))
				});
			return cb(null, plainTrips);
		} catch (e) {
			return cb(e);
		}
	})
}
