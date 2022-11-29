const fs = require('fs');
const path = require('path');

let controller;
let Controllers = [];

// Create Modules Middleware
fs.readdirSync(__dirname + '/../../Modules')
    .filter((module) => module.indexOf('.') !== 0 && module !== 'index.js')
    .forEach((module) => {
        fs.readdirSync(__dirname + `/../../Modules/${module}/controllers/`)
            .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js')
            .forEach((file) => {
                controller = require(path.join(
                    __dirname + `/../../Modules/${module}/controllers/`,
                    file
                ));
                Controllers[controller.name] = controller;
            });
    });

// Custom Controllers
fs.readdirSync(path.join(__dirname, '../../App/controllers/'))
    .filter((file) => file !== 'index.js')
    .forEach((file) => {
        controller = require(path.join(
            __dirname + '../../../App/controllers/',
            file
        ));
        Controllers[controller.name] = controller;
    });

module.exports = Controllers;
