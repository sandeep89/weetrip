/**
 * Module to perform trip related activities
 */

var model = require("../model");
var Trip = model.trip;
var tripModule = module.exports;

tripModule.createTrip = function(user, body, cb) {
	if (!user) {
		return cb(new Error('Invalid session token'))
	}
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
