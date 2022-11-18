const path = require("path");

const simsView = {
    name: 'simsView',
    version: '1.0.0',
    register: async function (server, options) {

        const simsView = function(view, viewOptions, request) {

            if (!viewOptions) {
                viewOptions = {};
            }

            if (!request)
            {
                request = {}
            }

            viewOptions['helpers'] = require(path.join(__dirname, `../helpers/ejsHelper`));
            viewOptions['request'] = request;

            return this.view(view, viewOptions);
        };

        server.decorate('toolkit', 'simsView', simsView);
    }
};

module.exports.name = 'simsView';
module.exports.object = simsView;