/**
 * User Model defination
 * name
 * mobile
 * verified
 * email
 * email_verified
 */

module.exports = function(sequelize, DataTypes) {
    var trip = sequelize.define("trip", {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        }
    });

    return trip;
};
