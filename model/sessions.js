/**
 * Model for user sessions
 */

module.exports = function(sequelize, DataTypes) {
	var user = sequelize.define("session", {
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			primaryKey: true,
			autoIncrement: true
		},
		user_id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false
		},
		otp: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false
		},
		token: {
			type: DataTypes.STRING,
			allowNull: true
		}
	});

	return user;
};
