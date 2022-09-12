const path = require("path");
const Home = require(path.join(__dirname, '../controllers/homeController'));
const m3u = require(path.join(__dirname, '../controllers/m3uController'));
const {middleware} = require(path.join(__dirname, '../../Core/middleware'));

module.exports = [
    {
        method: "GET",
        path: "/",
        handler: Home,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Home Page",
        }
    },
    {
        method: "GET",
        path: "/parse",
        handler: m3u.parseToDB,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Parse existing to db",
        }
    },
    {
        method: "GET",
        path: "/download",
        handler: m3u.downloadM3u,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Parse existing to db",
        }
    },
    {
        method: "GET",
        path: "/download/{clientID}",
        handler: m3u.downloadM3u,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Parse existing to db",
        }
    },
];
