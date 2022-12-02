const path = require('path');
const {Helpers} = require(path.join(__dirname, `../../Core/`));

const simsView = {
    name: 'simsView',
    version: '1.0.0',
    register: async function (server) {
        const simsView = function (view, viewOptions, request, extra) {
            if (!viewOptions) {
                viewOptions = {};
                viewOptions['helpers'] = {};
                viewOptions['request'] = {};
            }

            if (!request) {
                request = {};
            }

            viewOptions['helpers'] = Helpers.ejsHelpers;
            viewOptions['request'] = request;

            return this.view(view, viewOptions, extra);
        };

        server.decorate('toolkit', 'simsView', simsView);
    },
};

module.exports.name = 'simsView';
module.exports.object = simsView;
