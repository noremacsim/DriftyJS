const path = require('path');
const Feed = require(path.join(__dirname, '../controllers/feedController'));
const middleware = require(path.join(__dirname, '../../Core/middleware'));

module.exports = [
    {
        method: 'GET',
        path: '/posts/feed',
        handler: Feed.posts,
        config: {
            pre: [{method: middleware.apiAuth}],
            description: 'Get Recent Posts',
        },
    },
];
