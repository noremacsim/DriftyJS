const path = require('path');

module.exports = [
    {
        method: 'GET',
        path: '/assets/{file*}',
        handler: function (request, h) {
            return h.file(path.join(__dirname, `/../../App/assets/themes/${request.params.file}`));
        }
    }
];
