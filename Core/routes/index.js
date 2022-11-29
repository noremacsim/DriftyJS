const fs = require('fs');
const path = require('path');
const {Sequelize} = require("sequelize");

let CustomRoutes = [];
// Core Routes
fs.readdirSync(path.join(__dirname, '/'))
    .filter((file) => file !== 'index.js')
    .forEach((file) => {
        CustomRoutes = CustomRoutes.concat(
            require(path.join(__dirname, `/${file}`))
        );
    });

// Create Modules Routes
fs.readdirSync(__dirname + '/../../Modules')
    .filter((module) => module.indexOf('.') !== 0 && module !== 'index.js')
    .forEach((module) => {
        fs.readdirSync(__dirname + `/../../Modules/${module}/routes/`)
            .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js')
            .forEach((file) => {
                CustomRoutes = CustomRoutes.concat(
                    require(path.join(__dirname, `/../../Modules/${module}/routes/${file}`))
                );
            });
    });

// Custom Routes
fs.readdirSync(path.join(__dirname, '../../App/routes/'))
    .filter((file) => file !== 'index.js')
    .forEach((file) => {
        CustomRoutes = CustomRoutes.concat(
            require(path.join(__dirname, `../../App/routes/${file}`))
        );
    });

module.exports = CustomRoutes;
