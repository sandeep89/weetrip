/**
 * Module to perform trip related activities
 */

var model = require("../model");
var Trip = model.trip;
var UserTrip = model.user_trip;
var _File = model.file;
var Tag = model.tag;
var tripModule = module.exports;
var async = require('async');
var fs = require('fs');

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

tripModule.getTrip = function(query, cb) {
	Trip.find({
		where: {
			id: query.trip
		}
	}).then(function(trip) {
		var trip = trip.get({
			plain: true
		});
		async.parallel([
			function(cb1) {
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
					return cb1(null, tripUsers);
				})
			},
			function(cb1) {
				_File.findAll({
					where: {
						trip_id: trip.id
					}
				}).then(function(files) {
					trip.files = files;
					return cb1(null, files);
				})
			},
			function(cb1) {
				Tag.findAll({
					where: {
						trip_id: trip.id
					}
				}).then(function(tags) {
					trip.tags = tags;
					return cb1(null, tags);
				})
			}
		], function(err, result) {
			return cb(null, trip);
		});
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
				async.parallel([
					function(cb1) {
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
							return cb1(null, tripUsers);
						})
					},
					function(cb1) {
						_File.findAll({
							where: {
								trip_id: trip.id
							}
						}).then(function(files) {
							trip.files = files;
							return cb1(null, files);
						})
					},
					function(cb1) {
						Tag.findAll({
							where: {
								trip_id: trip.id
							}
						}).then(function(tags) {
							trip.tags = tags;
							return cb1(null, tags);
						})
					}
				], function(err, result) {
					plainTrips.push(trip);
					return callb(null);
				});
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

tripModule.uploadFiles = function(user, files, body, cb) {
	var uploadedFiles = [];
	async.each(files, function(file, callb) {
		var newPath = file.path.split('/');
		newPath = newPath.pop();
		// newPath.splice(0, 1);
		// newPath = newPath.join('/');
		// newPath = "/" + newPath + "/" + file.name;
		// fs.rename(file.path, newPath, function(err) {
		// 	if (err) return cb(err);
			uploadedFiles.push({
				url: "http://ec2-54-172-101-14.compute-1.amazonaws.com/" + newPath,
				name: file.name,
				trip_id: parseInt(body.trip),
				user_id: user.id,
				meta: JSON.stringify(file),
				type: file.type
			})
			//file.path = newPath;
			return callb(null);
		//});
	}, function(err) {
		if (err) return cb(err);
		_File.bulkCreate(uploadedFiles).then(function() {
			return cb(null, uploadedFiles);
		})
	})
}

tripModule.addTag = function(user, body, cb) {
	Tag.create({
		user_id: user.id,
		trip_id: body.trip,
		name: body.name,
		location: body.location
	}).then(function(tag) {
		return cb(null, tag);
	})
}
