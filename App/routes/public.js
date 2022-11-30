const path = require('path');
const Public = require(path.join(__dirname, '../controllers/publicController'));

module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: Public.home,
        config: {
            description: 'Welcome Page',
        },
    },
];
