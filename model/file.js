/**
 * Photo Model for adding places photos
 **/

module.exports = function(sequelize, DataTypes) {
	var photo = sequelize.define("file", {
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		},
		url: {
			type: DataTypes.STRING,
			allowNull: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		trip_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false
		},
		user_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false
		},
		meta: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		type: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		classMethods: {
			associate: function(models) {
				photo.belongsTo(models.user, {
					foreignKey: 'user_id'
				})
				photo.belongsTo(models.trip, {
					foreignKey: 'trip_id'
				})
			}
		}
	});

	return photo;
};
