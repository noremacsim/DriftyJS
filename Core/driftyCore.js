const Hapi = require("@hapi/hapi");
const path = require("path");
const {CustomRoutes, Models} = require(path.join(__dirname, './'));
const {plugins} = require(path.join(__dirname, './plugins'));
const PORT = process.env.PORT || 4101;

const init = async (type) => {

    // Server Options
    let options = {
        port: PORT
    };

    // Debugging Options
    Models.sequelize.options.logging = false;

    if (type === 'dev') {
        options['debug'] = {request: ['error']};
        Models.sequelize.options.logging = true
    }

    // Move globals to somewhere better?
    global.isLoggedIn = false;

    const server = new Hapi.Server(options);

    // TODO: Move this to plugin or helper.
    // Setup Cookies - Possibly move to new helper script?
    server.state('jwt', {
        ttl: null,
        isSecure: false,
        isHttpOnly: true,
        encoding: 'base64json',
        clearInvalid: true,
        strictHeader: true
    });

    // Register database models
    await Models.sequelize.sync();

    // Register Server Plugins
    await server.register(require('@hapi/vision'));
    await server.register(require('@hapi/inert'));
    await server.register(plugins.simsView);

    // Build Server Routes
    server.route(CustomRoutes);

    // Build View Handler to render templates
    server.views({
        engines: {
            html: require('ejs')
        },
        relativeTo: __dirname + '/../App/',
        path: 'views',
        layout: true,
        layoutPath: 'views/layouts',
        partialsPath: 'views/partials',
        helpersPath: 'views/helpers'
    });

    // Start Server
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", err => {
    console.log(err);
    process.exit(1);
});

module.exports = {init};
