module.exports = function(sequelize, DataTypes) {
	var trip = sequelize.define("trip", {
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			alloweNull: false
		},
		from: {
			type: DataTypes.STRING,
			alloweNull: false
		},
		to: {
			type: DataTypes.STRING,
			allowedNull: false
		},
		start_date: {
			type: DataTypes.DATE,
			allowedNull: false
		},
		end_date: {
			type: DataTypes.DATE,
			allowedNull: false
		},
		created_by: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowedNull: false
		}
	}, {
		classMethods: {
			associate: function(models) {
				trip.belongsTo(models.user, {
					foreignKey: 'created_by'
				})
			}
		}
	});

	return trip;
};
