/**
 * Module to store tag places
 **/

module.exports = function(sequelize, DataTypes) {
	var tags = sequelize.define("tag", {
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		},
		user_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false
		},
		trip_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false
		},
		name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		location: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		classMethods: {
			associate: function(models) {
				tags.belongsTo(models.trip, {
					foreignKey: 'trip_id'
				})
				tags.belongsTo(models.user, {
					foreignKey: 'user_id'
				})
			}
		}
	});

	return tags;
};
