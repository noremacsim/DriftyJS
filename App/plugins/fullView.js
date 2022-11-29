const fullView = {
    name: 'fullView',
    version: '1.0.0',
    register: async function (server) {
        const fullView = function (view, viewOptions) {
            if (!viewOptions) {
                viewOptions = {};
                viewOptions['helpers'] = {};
            }

            viewOptions['helpers']['fullView'] = true;

            return this.view(view, viewOptions);
        };

        server.decorate('toolkit', 'fullView', fullView);
    },
};

module.exports.name = 'fullView';
module.exports.object = fullView;
