module.exports = (sequelize, DataTypes) => {
    const Group = sequelize.define('Group', {
        name: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Company Requires a name',
                },
            },
        },
    });

    Group.associate = function (models) {
        Group.belongsToMany(models.Company, {through: 'company_groups'});
        Group.belongsToMany(models.User, {through: 'group_users'});
    };

    return Group;
};
