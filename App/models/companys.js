module.exports = (sequelize, DataTypes) => {
    const Company = sequelize.define('Company', {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Company Requires a name',
                },
            },
        },
    });

    Company.associate = function (models) {
        Company.belongsToMany(models.User, {through: 'company_users'});
        Company.belongsToMany(models.Group, {through: 'company_groups'});
    };

    return Company;
};
