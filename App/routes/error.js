const Boom = require('boom');

module.exports = [
    {
        method: ['GET', 'POST'],
        path: '/{any*}',
        handler: (request, h) => {
            const accept = request.headers.accept;

            if (accept && accept.match(/json/)) {
                return Boom.notFound('This resource isn’t available.');
            }

            return h.fullView('error/404', null).code(404);
        },
    },
];
