const path = require("path");
const Home = require(path.join(__dirname, '../controllers/homeController'));
const m3u = require(path.join(__dirname, '../controllers/m3uController'));

module.exports = [
    {
        method: "GET",
        path: "/",
        handler: Home,
        config: {
            description: "Gets all the notes available",
        }
    },
    {
        method: "GET",
        path: "/parse",
        handler: m3u.parseToDB,
        config: {
            description: "Parse existing to db",
        }
    },
    {
        method: "GET",
        path: "/download",
        handler: m3u.downloadM3u,
        config: {
            description: "Parse existing to db",
        }
    },
    {
        method: "GET",
        path: "/download/{userID}",
        handler: m3u.downloadM3u,
        config: {
            description: "Parse existing to db",
        }
    },
];