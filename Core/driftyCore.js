const Hapi = require("@hapi/hapi");
const path = require("path");
const {CustomRoutes, Models} = require(path.join(__dirname, './'));
const PORT = process.env.PORT || 4101;

const init = async (type) => {

    let options = {
        port: PORT
    };

    Models.sequelize.options.logging = false;

    if (type === 'dev') {
        options['debug'] = {request: ['error']};
        Models.sequelize.options.logging = true
    }

    const server = new Hapi.Server(options);
    server.route(CustomRoutes);

    await Models.sequelize.sync();
    await server.register(require('@hapi/vision'));

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

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", err => {
    console.log(err);
    process.exit(1);
});

module.exports = {init};