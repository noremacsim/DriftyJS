const path = require('path');
const Home = require(path.join(__dirname, '../controllers/homeController'));
const {middleware} = require(path.join(__dirname, '../../Core/middleware'));

module.exports = [
    {
        method: 'GET',
        path: '/',
        config: {
            handler: async function (request, h) {
                const connect = await middleware.auth(request, h);
                if (connect === 'passed') {
                    return Home.main(request, h);
                }
                return connect;
            },
            description: 'Goto Main HomePage',
        },
    },
];
