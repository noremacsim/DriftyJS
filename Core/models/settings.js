module.exports = (sequelize, DataTypes) => {
    const Drifty_Settings = sequelize.define('Drifty_Settings', {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Requires a name',
                },
            },
        },
        step: DataTypes.SMALLINT,
    });

    return Drifty_Settings;
};
