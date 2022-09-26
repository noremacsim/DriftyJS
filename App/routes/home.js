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
        method: 'POST',
        path: '/upload',
        config: {
            pre: [{ method: middleware.auth }],
            payload: {
                maxBytes: 209715200,
                output: 'file',
                parse: true,
                multipart: true
            }
        },
        handler: m3u.parseToDB,
    },
    {
        method: "POST",
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
