module.exports.name = 'path';
module.exports.functions = {
    exists: function (request, h) {
        // Check if path exists in routes
        let requestedPath = '/';
        const checkRequestedPath = (obj) => obj.path === request?.route?.path;
        h.request.server._core.router.routes.forEach((element) => {
            if (element.routes.some(checkRequestedPath)) {
                requestedPath = request?.route?.path;
            }
        });

        if (requestedPath === '/{any*}') {
            requestedPath = '/';
        }

        return request?.route?.path ? requestedPath : false;
    },
};
