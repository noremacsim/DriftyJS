const Moment = require("moment");


module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Username Required'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        firstname: DataTypes.STRING,
        middlename: DataTypes.STRING,
        lastname: DataTypes.STRING,
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    });

    User.associate = function(models) {
        User.hasMany(models.UserGroups);
    };

    return User;
};