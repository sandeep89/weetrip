module.exports = function(sequelize, DataTypes) {
	var userTrip = sequelize.define("user_trip", {
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		},
		trip_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowedNull: false
		},
		user_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowedNull: false
		},
		status: {
			type: DataTypes.STRING,
			allowedNull: false,
			defaultValue: 'INVITED'
		}
	}, {
		classMethods: {
			associate: function(models) {
				userTrip.belongsTo(models.user, {
					foreignKey: 'user_id'
				});
				userTrip.belongsTo(models.trip, {
					foreignKey: 'trip_id'
				})
			}
		}
	});

	return userTrip;
};
