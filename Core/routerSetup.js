const fs = require('fs');
const path = require('path');

let CustomRoutes = [];

fs.readdirSync(path.join(__dirname, '../App/routes/'))
    .filter((file) => file !== 'index.js')
    .forEach((file) => {
        CustomRoutes = CustomRoutes.concat(
            require(path.join(__dirname, `../App/routes/${file}`))
        );
    });

module.exports = {CustomRoutes};
