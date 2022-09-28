module.exports = (sequelize, DataTypes) => {
    const Sessons = sequelize.define("Sessons", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        logo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        imbdid: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        season: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        episodes: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        overview: {
            type: DataTypes.TEXT('medium'),
            allowNull: true,
        },
        coverImg: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    });

    Sessons.associate = function(models) {
        Sessons.hasMany(models.Channels);
        Sessons.belongsTo(models.Series);
        Sessons.belongsTo(models.User);
    };


    return Sessons;
};
