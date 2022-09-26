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
        email: DataTypes.STRING,
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        trial: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        exp_date: {
         type: DataTypes.DATEONLY,
         allowNull: true,
       },
    });

    Client.associate = function(models) {
        Client.hasMany(models.ClientGroups);
        Client.belongsTo(models.User);
    };

    return Client;
};
