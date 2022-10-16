const Moment = require("moment");


module.exports = (sequelize, DataTypes) => {
    const Groups = sequelize.define("Groups", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mapped: DataTypes.STRING,
        VOD: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        type: DataTypes.STRING,
    });

    Groups.associate = function(models) {
        Groups.hasMany(models.Channels);
        Groups.hasMany(models.ClientGroups);
        Groups.hasMany(models.ChannelGroups);
        Groups.hasMany(models.Series);
        Groups.belongsTo(models.User);
    };

    return Groups;
};
