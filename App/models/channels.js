module.exports = (sequelize, DataTypes) => {
    const Channels = sequelize.define("Channels", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tvgid: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        logo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    Channels.associate = function(models) {
        Channels.belongsTo(models.Groups);
        Channels.belongsTo(models.User);
    };


    return Channels;
};