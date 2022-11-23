const dotenv = require("dotenv");
const { Sequelize } = require('sequelize');
const path = require("path");
const fs = require("fs");

dotenv.config();

const sequelize = new Sequelize(process.env.SQL_DB, process.env.SQL_USER, process.env.SQL_PASSWORD, {
    host: process.env.SQL_HOST,
    dialect: process.env.SQL_DIALECT,
    logging: false
});

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

const db = {};

// reate Models
fs.readdirSync(__dirname + '/../../App/models/')
    .filter(file => file.indexOf(".") !== 0 && file !== "index.js")
    .forEach(file => {
        const model = require(path.join(__dirname + '/../../App/models/', file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
