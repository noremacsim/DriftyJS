const path = require('path');
const fs = require('fs');

let type;
const plugins = {};

// Core Plugins
fs.readdirSync(__dirname + '/')
    .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js')
    .forEach((file) => {
        type = require(path.join(__dirname + '/', file));
        plugins[type.name] = type.object;
    });

// Create Modules Plugins
fs.readdirSync(__dirname + '/../../Modules')
    .filter((module) => module.indexOf('.') !== 0 && module !== 'index.js' && module !== 'readme.md')
    .forEach((module) => {
        fs.readdirSync(__dirname + `/../../Modules/${module}/plugins/`)
            .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js')
            .forEach((file) => {
                type = require(path.join(__dirname + `/../../Modules/${module}/plugins/`, file));
                plugins[type.name] = type.object;
            });
    });

// Custom Plugins
fs.readdirSync(__dirname + '/../../App/plugins/')
    .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js')
    .forEach((file) => {
        type = require(path.join(__dirname + '/../../App/plugins/', file));
        plugins[type.name] = type.object;
    });

module.exports = plugins;
