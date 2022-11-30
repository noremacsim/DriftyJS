module.exports = (sequelize, DataTypes) => {
    const Drifty_Modules = sequelize.define('Drifty_Modules', {
        name: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Requires a name',
                },
            },
        },
        url: DataTypes.STRING,
        status: DataTypes.STRING,
    });

    return Drifty_Modules;
};
