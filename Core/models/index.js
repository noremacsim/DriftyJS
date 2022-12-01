const dotenv = require('dotenv');
const {Sequelize} = require('sequelize');
const path = require('path');
const fs = require('fs');

dotenv.config();

const sequelize = new Sequelize(
    process.env.SQL_DB,
    process.env.SQL_USER,
    process.env.SQL_PASSWORD,
    {
        host: process.env.SQL_HOST,
        dialect: process.env.SQL_DIALECT,
        logging: false,
    }
);

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

const db = {};

// Create Core Models
fs.readdirSync(__dirname + '/')
    .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js' && file !== 'readme.md')
    .forEach((file) => {
        const model = require(path.join(__dirname + '/', file)) (
            sequelize,
            Sequelize.DataTypes
        );
        db[model.name] = model;
    });

// Create Modules Models
fs.readdirSync(__dirname + '/../../Modules')
    .filter((module) => module.indexOf('.') !== 0 && module !== 'index.js' && module !== 'readme.md')
    .forEach((module) => {
        fs.readdirSync(__dirname + `/../../Modules/${module}/models/`)
            .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js')
            .forEach((file) => {
                const model = require(path.join(
                    __dirname + `/../../Modules/${module}/models/`,
                    file
                ))(sequelize, Sequelize.DataTypes);
                db[model.name] = model;
            });
    });

// Create Custom Models
fs.readdirSync(__dirname + '/../../App/models/')
    .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js' && file !== 'readme.md')
    .forEach((file) => {
        const model = require(path.join(
            __dirname + '/../../App/models/',
            file
        ))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
