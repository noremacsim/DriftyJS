const path = require("path");
const fs = require("fs");

let type;
const plugins = {};
fs.readdirSync(__dirname + '/../../App/plugins/')
    .filter(file => file.indexOf(".") !== 0 && file !== "index.js")
    .forEach(file => {
        type = require(path.join(__dirname + '/../../App/plugins/', file))
        plugins[type.name] = type.object;
    });

module.exports = {plugins}