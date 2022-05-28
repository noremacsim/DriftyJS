const path = require("path");
const Home = require(path.join(__dirname, '../controllers/homeController'));
const {middleware} = require(path.join(__dirname, '../../Core/middleware'));

module.exports = [
    {
        method: "GET",
        path: "/",
        handler: Home,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Gets all the notes available",
        }
    },
];