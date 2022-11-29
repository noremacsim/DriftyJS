module.exports = (sequelize, DataTypes) => {
    const Drifty_Routes_Middleware = sequelize.define(
        'Drifty_Routes_Middleware',
        {
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
        }
    );

    Drifty_Routes_Middleware.associate = function (models) {
        Drifty_Routes_Middleware.belongsTo(models.Drifty_Routes);
    };

    return Drifty_Routes_Middleware;
};
