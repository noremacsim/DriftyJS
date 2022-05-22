const fs = require('fs');
const path = require("path");

let CustomRoutes = [];

fs.readdirSync(path.join(__dirname, '../router/'))
    .filter(file => file !== 'index.js')
    .forEach(file => {
        CustomRoutes = CustomRoutes.concat(require(path.join(__dirname, `../router/${file}`)))
    });

module.exports = {CustomRoutes};