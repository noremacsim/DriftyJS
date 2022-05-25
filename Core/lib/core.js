const Hapi = require("@hapi/hapi");
const customRoutes = require('./route.js');
const PORT = process.env.PORT || 4101;

const Drifty = {
    config: {
        title: 'test',
        appDir: '/App'
    },
    server:{
        options:{
            port: PORT
        }
    },
    views: true
};

exports = module.exports = Drifty.Core = class {
    constructor() {
        this.phase = 'stopped';
        this.server = new Hapi.Server(Drifty.server.options);
        this.models = require('./models.js');
        this.customRoutes = new customRoutes();
    }


    async _serverView() {
        await this.server.register(require('@hapi/vision'));
        this.server.views({
            engines: {
                html: require('ejs')
            },
            relativeTo: __dirname + '../../App',
            path: 'views',
            layout: true,
            layoutPath: 'views/layouts',
            partialsPath: 'views/partials',
            helpersPath: 'views/helpers'
        });
    }

    async start() {
        if (Drifty.views) {
            await this._serverView();
        }
        this.server.route(this.customRoutes.routes)
        await this.server.start();
        this.phase = 'start';
        console.log(`Server running at: ${this.server.info.uri}`);
    }
}