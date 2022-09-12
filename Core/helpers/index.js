const path = require("path");
const fs = require("fs");

let type;
const helpers = {};
fs.readdirSync(__dirname + '/../../App/helpers/')
    .filter(file => file.indexOf(".") !== 0 && file !== "index.js")
    .forEach(file => {
        type = require(path.join(__dirname + '/../../App/helpers/', file))
        helpers[type.name] = type.function;
    });

module.exports = {helpers}
