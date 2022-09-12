const Moment = require("moment");


module.exports = (sequelize, DataTypes) => {
    const Groups = sequelize.define("Groups", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    Groups.associate = function(models) {
        Groups.hasMany(models.Channels);
        Groups.hasMany(models.ClientGroups);
        Groups.belongsTo(models.User);
    };

    return Groups;
};
