const Boom = require('boom');

module.exports = [
    {
        method: ['GET', 'POST'],
        path: '/{any*}',
        handler: (request, h) => {
            const accept = request.headers.accept;

            if (!process.env.INSTALLED) {
                return h.view('core/installer/main', null, {layout: 'core/layout/installer'});
            }

            if (accept && accept.match(/json/)) {
                return Boom.notFound('This resource isn’t available.');
            }

            return h.view('core/errors/404', null, {layout: 'core/layout/app'}).code(404);
        },
    },
];

