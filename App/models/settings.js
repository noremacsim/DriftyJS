module.exports = (sequelize, DataTypes) => {
    const Settings = sequelize.define("Settings", {
        Type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    });

    return Settings;
};
