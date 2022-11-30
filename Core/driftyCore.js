const Hapi = require('@hapi/hapi');
const path = require('path');
const {Routes, Models, Plugins} = require(path.join(__dirname, './'));
const cookies = require(path.join(__dirname, '../App/config/cookies.js'));
const Boom = require("boom");
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
    for (let [customPluginName, customPlugin] of Object.entries(Plugins)) {
        await server.register(customPlugin);
    }

    // Build Server Routes
    let CustomRoutes;
    if (!process.env.INSTALLED) {
        CustomRoutes = [];
        CustomRoutes = CustomRoutes.concat(require(path.join(__dirname, `/routes/assets.js`)));
        CustomRoutes = CustomRoutes.concat(require(path.join(__dirname, `/installer/routes.js`)));
        CustomRoutes = CustomRoutes.concat(
            {
                method: ['GET', 'POST'],
                path: '/{any*}',
                handler: (request, h) => {
                    const accept = request.headers.accept;
                        return h.view('core/installer/main', null, {layout: 'core/layout/installer'});
                },
            }
        );
        console.log('starting installer');
        server.route(CustomRoutes);
    } else {
        console.log('starting main app');
        server.route(Routes);
    }

    // Build View Handler to render templates
    server.views({
        engines: {
            html: require('ejs'),
        },
        relativeTo: __dirname + '/../App/',
        path: 'themes',
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
