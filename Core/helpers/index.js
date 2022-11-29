const path = require('path');
const fs = require('fs');

let type;
const helpers = {};

// Core Plugins
fs.readdirSync(__dirname + '/')
    .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js')
    .forEach((file) => {
        type = require(path.join(__dirname + '/', file));
        helpers[type.name] = type.functions;
    });

// Custom Plugins
fs.readdirSync(__dirname + '/../../App/helpers/')
    .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js')
    .forEach((file) => {
        type = require(path.join(__dirname + '/../../App/helpers/', file));
        helpers[type.name] = type.functions;
    });

module.exports = helpers;
