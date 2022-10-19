const path = require("path");
const { DataTypes } = require('sequelize')

//Methods = {addColumn, changeColumn, removeColumn}
module.exports = [
    {
        method: 'addColumn',
        table: "Channels",
        field: "youtube_trailer",
        config: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
        method: 'addColumn',
        table: "Channels",
        field: "rating",
        config: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
        method: 'addColumn',
        table: "Channels",
        field: "source",
        config: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
        method: 'addColumn',
        table: "Channels",
        field: "sourceID",
        config: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
];
