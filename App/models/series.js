module.exports = (sequelize, DataTypes) => {
    const Series = sequelize.define("Series", {
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
        releaseDate: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        coverImg: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        backdropImg: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        plot: {
            type: DataTypes.TEXT('medium'),
            allowNull: true,
        },
        runtime: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        youtubeID: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    });

    Series.associate = function(models) {
        Series.belongsTo(models.Groups);
        Series.hasMany(models.Sessons);
        Series.hasMany(models.Channels);
        Series.hasMany(models.SeriesGroups);
        Series.belongsTo(models.User);
    };

    return Series;
};
