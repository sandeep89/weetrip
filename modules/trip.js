/**
 * Module to perform trip related activities
 */

var model = require("../model");
var Trip = model.trip;
var UserTrip = model.user_trip;
var tripModule = module.exports;
var async = require('async');

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
			UserTrip.create({
				trip_id: trip.id,
				user_id: user.id,
				status: 'ADDED'
			}).then(function(userTrip) {
				return cb(null, trip);
			})
		} catch (e) {
			return cb(e);
		}
	}).catch(function(err) {
		return cb(err);
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
			async.each(trips, function(trip, callb) {
				var trip = trip.get({
					plain: true
				});
				UserTrip.findAll({
					where: {
						trip_id: trip.id
					},
					include: [{
						all: true,
						nested: true
					}]
				}).then(function(userTrips) {
					var tripUsers = [];
					userTrips.forEach(function(userTrips) {
						tripUsers.push(userTrips.user);
					})
					trip.users = tripUsers;
					plainTrips.push(trip);
					return callb(null);
				})
			}, function(err) {
				if (err) {
					return cb(err);
				}
				return cb(null, plainTrips);
			});
		} catch (e) {
			return cb(e);
		}
	})
}

tripModule.addUser = function(trip, users, cb) {
	var users = users ? users.split(',') : undefined;
	if (users && users.length) {
		var bulkUserTrips = [];
		users.forEach(function(user) {
			bulkUserTrips.push({
				user_id: user,
				trip_id: trip
			})
		});
		UserTrip.
		bulkCreate(bulkUserTrips).
		then(function() {
			UserTrip.findAll({
				where: {
					trip_id: trip
				},
				include: [{
					all: true,
					nested: true
				}]
			}).then(function(userTrips) {
				var updatedTrip = userTrips[0].get({
					plain: true
				});
				updatedTrip = updatedTrip.trip;
				delete updatedTrip.user;
				var tripUsers = [];
				userTrips.forEach(function(userTrips) {
					tripUsers.push(userTrips.user);
				})
				updatedTrip.users = tripUsers;
				return cb(null, updatedTrip);
			})
		}).catch(function(err) {
			return cb(err);
		})
	} else {
		return cb(new Error('Invalid user list for insert'));
	}
}
