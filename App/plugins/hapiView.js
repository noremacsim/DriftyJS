const path = require("path");

const simsView = {
    name: 'simsView',
    version: '1.0.0',
    register: async function (server, options) {

        const simsView = function(view, viewOptions) {

            if (!viewOptions) {
                viewOptions = {};
            }

            viewOptions['helpers'] = require(path.join(__dirname, `../helpers/ejsHelper`));

            return this.view(view, viewOptions);
        };

        server.decorate('toolkit', 'simsView', simsView);
    }
};

module.exports.name = 'simsView';
module.exports.object = simsView;