const fs = require('fs');
const path = require('path');

let controller;
let Controllers = [];

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
