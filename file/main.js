function getTripDetails(tripId) {
	$.ajax({
		url: "/api/trip/gettrip",
		type: 'GET',
		dataType: 'json',
		data: {
			trip: tripId
		},
		headers: {
			'x-auth-token': 'aa665a66ac47cf4ecad2b8526cb82cc7ac88454c'
		},
		contentType: 'application/json; charset=utf-8',
		success: function(result) {
			var trip = result.trip;
			$('#timeline').text(trip.name + " Timeline");
			$('#created').text("Created by: " + trip.owner.name);
			$('#start_date').text((new Date(trip.start_date)).toDateString());
			$('#end_date').text((new Date(trip.end_date)).toDateString());

		},
		error: function(error) {}
	});
}
getTripDetails(1);
