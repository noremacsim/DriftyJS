const path = require('path');
const {Controllers} = require(path.join(__dirname, '../../Core/'));
const middleware = require(path.join(__dirname, '../../Core/middleware'));

module.exports = [
    {
        method: 'GET',
        path: '/user/login',
        handler: Controllers.user.signinView,
        config: {
            description: 'Login User',
        },
    },
    {
        method: 'GET',
        path: '/user/settings',
        config: {
            handler: async function (request, h) {
                const connect = await middleware.auth(request, h);
                if (connect === 'passed') {
                    return Controllers.user.settingsView(request, h);
                }
                return connect;
            },
            description: 'Goto User Settings Page',
        },
    },
];
