module.exports = (sequelize, DataTypes) => {

    const Drifty_Routes_Method = sequelize.define('Drifty_Routes_Method', {
        type: DataTypes.ENUM('GET', 'POST', 'PUT'),
    });

    Drifty_Routes_Method.associate = function (models) {
        Drifty_Routes_Method.belongsTo(models.Drifty_Routes);
    };

    return Drifty_Routes_Method;
};
