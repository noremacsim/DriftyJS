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
            type: DataTypes.TEXT('medium'),
            allowNull: false,
        },
        tvgtype: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        imbdid: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        episode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        releaseDate: {
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
        coverImg: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        rating: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        youtube_trailer: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        source: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        sourceID: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    });

    Channels.associate = function(models) {
        Channels.belongsTo(models.Groups);
        Channels.belongsTo(models.User);
        Channels.belongsTo(models.Sessons);
        Channels.hasMany(models.ChannelGroups);
        Channels.hasMany(models.RecentlyPlayed);
    };


    return Channels;
};
