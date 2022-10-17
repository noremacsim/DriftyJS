const path = require("path");
const movies = require(path.join(__dirname, '../controllers/moviesController'));
const groups = require(path.join(__dirname, '../controllers/groupsController'));
const channels = require(path.join(__dirname, '../controllers/channelsController'));
const {middleware} = require(path.join(__dirname, '../../Core/middleware'));

module.exports = [
    {
        method: "GET",
        path: "/groups/movies",
        handler: groups.movies,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Gets all the groups available",
        }
    },
    {
        method: "GET",
        path: "/movies/{groupID}",
        handler: movies.viewByGroup,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Gets all the movie available",
        }
    },
    {
        method: "GET",
        path: "/movies/{groupID}/new/{movieID}",
        handler: movies.editView,
        config: {
            pre: [{ method: middleware.auth }],
            description: "New Movie",
        }
    },
    {
        method: "GET",
        path: "/movies/{groupID}/new/",
        handler: movies.editView,
        config: {
            pre: [{ method: middleware.auth }],
            description: "New Movie",
        }
    },
];
