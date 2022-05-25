const path = require("path");
const fs = require("fs");

const Drifty = {};

exports = module.exports = Drifty.Route = class {
    constructor() {
        let CustomRoutes = [];
        fs.readdirSync(path.join(__dirname, '../../App/routes/'))
            .filter(file => file !== 'index.js')
            .forEach(file => {
                CustomRoutes = CustomRoutes.concat(require(path.join(__dirname, `../../App/routes/${file}`)))
            });
        this.routes = CustomRoutes;
    }
};
