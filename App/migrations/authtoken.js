const {DataTypes} = require('sequelize');

//Methods = {addColumn, changeColumn, removeColumn}
module.exports = [
    {
        method: 'addColumn',
        table: 'AuthToken',
        field: 'TwoFactorPassed',
        config: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: false,
        },
    },
];
