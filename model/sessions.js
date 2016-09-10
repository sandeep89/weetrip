/**
 * Model for user sessions
 */

module.exports = function(sequelize, DataTypes) {
	var session = sequelize.define("session", {
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
		},
		mobile: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		classMethods: {
			associate: function(models) {
				session.belongsTo(models.user, {
					foreignKey: 'user_id'
				})
			}
		}
	});

	return session;
};
