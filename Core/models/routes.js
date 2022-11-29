module.exports = (sequelize, DataTypes) => {
    const Drifty_Routes = sequelize.define('Drifty_Routes', {
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
        path: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Requires a path',
                },
            },
        },
        handler: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Requires a handler',
                },
            },
        },
        description: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: true,
        },
    });

    Drifty_Routes.associate = function (models) {
        Drifty_Routes.hasMany(models.Drifty_Routes_Method);
        Drifty_Routes.hasMany(models.Drifty_Routes_Middleware);
    };

    return Drifty_Routes;
};
