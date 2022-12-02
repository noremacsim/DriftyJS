const fs = require('fs');
const path = require('path');

let CustomRoutes = [];

// Core Routes
fs.readdirSync(path.join(__dirname, '/'))
    .filter((file) => file !== 'index.js' && file !== 'readme.md')
    .forEach((file) => {
        CustomRoutes = CustomRoutes.concat(
            require(path.join(__dirname, `/${file}`))
        );
    });

// Create Modules Routes This can override Core Routes
fs.readdirSync(__dirname + '/../../Modules')
    .filter(
        (module) =>
            module.indexOf('.') !== 0 &&
            module !== 'index.js' &&
            module !== 'readme.md'
    )
    .forEach((module) => {
        if (fs.existsSync(__dirname + `/../../Modules/${module}/routes/`)) {
            fs.readdirSync(__dirname + `/../../Modules/${module}/routes/`)
                .filter(
                    (file) => file.indexOf('.') !== 0 && file !== 'index.js'
                )
                .forEach((file) => {
                    CustomRoutes = CustomRoutes.concat(
                        require(path.join(
                            __dirname,
                            `/../../Modules/${module}/routes/${file}`
                        ))
                    );
                });
        }
    });

// Custom Routes - Custom Routes can override Moduled Routes and Core
fs.readdirSync(path.join(__dirname, '../../App/routes/'))
    .filter((file) => file !== 'index.js' && file !== 'readme.md')
    .forEach((file) => {
        CustomRoutes = CustomRoutes.concat(
            require(path.join(__dirname, `../../App/routes/${file}`))
        );
    });

module.exports = CustomRoutes;
