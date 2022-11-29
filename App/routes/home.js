const path = require('path');
const Home = require(path.join(__dirname, '../controllers/homeController'));
const {Middleware} = require(path.join(__dirname, '../../Core/'));

module.exports = [
    {
        method: 'GET',
        path: '/',
        config: {
            handler: async function (request, h) {
                const connect = await Middleware.auth(request, h);
                if (connect === 'passed') {
                    return Home.main(request, h);
                }
                return connect;
            },
            description: 'Goto Main HomePage',
        },
    },
];
