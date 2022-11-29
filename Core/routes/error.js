const Boom = require('boom');
const pathHelpers = require("../helpers/paths");

module.exports = [
    {
        method: ['GET', 'POST'],
        path: '/{any*}',
        handler: (request, h) => {
            const accept = request.headers.accept;

            const requestedPath = pathHelpers.exists(request, h)
            if (requestedPath)
            {
                return h.redirect(`/user/login?path=${requestedPath}`);
            }

            if (accept && accept.match(/json/)) {
                return Boom.notFound('This resource isn’t available.');
            }

            return h.fullView('error/404', null).code(404);
        },
    },
];
