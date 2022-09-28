const path = require("path");
const movies = require(path.join(__dirname, '../controllers/moviesController'));
const channels = require(path.join(__dirname, '../controllers/channelsController'));
const {middleware} = require(path.join(__dirname, '../../Core/middleware'));

module.exports = [
    {
        method: "GET",
        path: "/movies",
        handler: movies.view,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Gets all the movie available",
        }
    },
    {
        method: "GET",
        path: "/movies/new/{movieID}",
        handler: movies.editView,
        config: {
            pre: [{ method: middleware.auth }],
            description: "New Movie",
        }
    },
    {
        method: "GET",
        path: "/movies/new/",
        handler: movies.editView,
        config: {
            pre: [{ method: middleware.auth }],
            description: "New Movie",
        }
    },
];
