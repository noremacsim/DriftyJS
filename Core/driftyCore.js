const Hapi = require('@hapi/hapi');
const path = require('path');
const {CustomRoutes, Models} = require(path.join(__dirname, './'));
const {plugins} = require(path.join(__dirname, './plugins'));
const cookies = require(path.join(__dirname, '../App/config/cookies.js'));
const PORT = process.env.PORT || 4101;

const init = async (type) => {
    const corsOrigin = process.env.CORS_ORIGIN.split(',');
    const corsHeaders = process.env.CORS_HEADERS.split(',');
    const corsAdditionalHeaders = process.env.CORS_ADDITIONALHEADERS.split(',');

    // Server Options
    let options = {
        port: PORT,
        routes: {
            cors: {
                origin: corsOrigin,
                headers: corsHeaders,
                additionalHeaders: corsAdditionalHeaders,
            },
        },
    };

    // Debugging Options
    Models.sequelize.options.logging = false;

    if (type === 'dev') {
        options['debug'] = {request: ['error']};
        Models.sequelize.options.logging = true;
    }

    const server = new Hapi.Server(options);

    // eslint-disable-next-line
    for (let [key, customCookie] of Object.entries(cookies)) {
        server.state(customCookie.name, customCookie.options);
    }

    // Register database models
    await Models.sequelize.sync();

    // Register Server Plugins
    await server.register(require('@hapi/vision'));
    await server.register(require('@hapi/inert'));

    // Register Custom plugins
    // eslint-disable-next-line
    for (let [customPluginName, customPlugin] of Object.entries(plugins)) {
        await server.register(customPlugin);
    }

    // Build Server Routes
    server.route(CustomRoutes.CustomRoutes);

    // Build View Handler to render templates
    server.views({
        engines: {
            html: require('ejs'),
        },
        relativeTo: __dirname + '/../App/',
        path: 'views',
        layout: true,
        layoutPath: 'views/layouts',
        partialsPath: 'views/partials',
        helpersPath: 'views/helpers',
    });

    // Start Server
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

module.exports = {init};
