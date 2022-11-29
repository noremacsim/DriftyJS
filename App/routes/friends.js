const path = require('path');
const Friends = require(path.join(
    __dirname,
    '../controllers/friendsController'
));
const middleware = require(path.join(__dirname, '../../Core/middleware'));

module.exports = [
    {
        method: 'POST',
        path: '/friends/request',
        handler: Friends.newRequest,
        config: {
            pre: [{method: middleware.apiAuth}],
            description: 'Send New Friend Request',
        },
    },
    {
        method: 'POST',
        path: '/friends/accept',
        handler: Friends.acceptRequest,
        config: {
            pre: [{method: middleware.apiAuth}],
            description: 'Send New Friend Request',
        },
    },
    {
        method: 'POST',
        path: '/friends/remove',
        handler: Friends.removeFriend,
        config: {
            pre: [{method: middleware.apiAuth}],
            description: 'Send New Friend Request',
        },
    },
    {
        method: 'GET',
        path: '/friends',
        handler: Friends.getFriends,
        config: {
            pre: [{method: middleware.apiAuth}],
            description: 'Get Friends',
        },
    },
];
