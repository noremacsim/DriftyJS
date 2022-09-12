const Moment = require("moment");


module.exports = (sequelize, DataTypes) => {
    const Client = sequelize.define("Client", {
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

    Client.associate = function(models) {
        Client.hasMany(models.ClientGroups);
        Client.belongsTo(models.User);
    };

    return Client;
};
