const fs = require('fs');
const path = require('path');

let CustomRoutes = [];
// Core Routes
fs.readdirSync(path.join(__dirname, '/'))
    .filter((file) => file !== 'index.js')
    .forEach((file) => {
        CustomRoutes = CustomRoutes.concat(
            require(path.join(__dirname, `/${file}`))
        );
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
