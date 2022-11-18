const path = require("path");
const Home = require(path.join(__dirname, '../controllers/homeController'));
const {middleware} = require(path.join(__dirname, '../../Core/middleware'));

module.exports = [
    {
        method: "GET",
        path: "/",
        handler: Home.main,
        config: {
            pre: [{assign: 'redirect', method: middleware.auth }],
            description: "Goto Main HomePage",
        }
    },
];
