const path = require('path');
const User = require(path.join(__dirname, '../controllers/userController'));
const {middleware} = require(path.join(__dirname, '../../Core/middleware'));

module.exports = [
    {
        method: 'POST',
        path: '/user/login',
        handler: User.login,
        config: {
            description: 'Login User',
        },
    },
    {
        method: 'POST',
        path: '/user/logout',
        handler: User.logout,
        config: {
            description: 'Logout User',
        },
    },
    {
        method: 'POST',
        path: '/user/register',
        handler: User.register,
        config: {
            description: 'Register User',
        },
    },
    {
        method: 'GET',
        path: '/user',
        handler: User.details,
        config: {
            pre: [{method: middleware.apiAuth}],
            description: 'User Details',
        },
    },
    {
        method: 'POST',
        path: '/user/update',
        handler: User.update,
        config: {
            pre: [{method: middleware.apiAuth}],
            description: 'Update User',
        },
    },
    {
        method: 'GET',
        path: '/user/2fa/new',
        handler: User.new2Fa,
        config: {
            pre: [{method: middleware.apiAuth}],
            description: 'User Details',
        },
    },
    {
        method: 'POST',
        path: '/user/2fa/validate',
        handler: User.enable2Fa,
        config: {
            pre: [{method: middleware.twofaCheck}],
            description: 'User Details',
        },
    },
    {
        method: 'GET',
        path: '/user/login',
        handler: User.signinView,
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
                    return User.settingsView(request, h);
                }
                return connect;
            },
            description: 'Goto User Settings Page',
        },
    },
];
