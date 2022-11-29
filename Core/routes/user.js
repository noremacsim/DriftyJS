const path = require('path');
const {Controllers, Middleware} = require(path.join(__dirname, '../'));

module.exports = [
    {
        method: 'POST',
        path: '/user/login',
        handler: Controllers.user.login,
        config: {
            description: 'Login User',
        },
    },
    {
        method: 'POST',
        path: '/user/logout',
        handler: Controllers.user.logout,
        config: {
            description: 'Logout User',
        },
    },
    {
        method: 'POST',
        path: '/user/register',
        handler: Controllers.user.register,
        config: {
            description: 'Register User',
        },
    },
    {
        method: 'GET',
        path: '/user',
        handler: Controllers.user.details,
        config: {
            pre: [{method: Middleware.apiAuth}],
            description: 'User Details',
        },
    },
    {
        method: 'POST',
        path: '/user/update',
        handler: Controllers.user.update,
        config: {
            pre: [{method: Middleware.apiAuth}],
            description: 'Update User',
        },
    },
    {
        method: 'GET',
        path: '/user/2fa/new',
        handler: Controllers.user.new2Fa,
        config: {
            pre: [{method: Middleware.apiAuth}],
            description: 'User Details',
        },
    },
    {
        method: 'POST',
        path: '/user/2fa/validate',
        handler: Controllers.user.enable2Fa,
        config: {
            pre: [{method: Middleware.twofaCheck}],
            description: 'User Details',
        },
    },
];
