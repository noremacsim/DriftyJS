const path = require("path");
const episodes = require(path.join(__dirname, '../controllers/episodesController'));
const {middleware} = require(path.join(__dirname, '../../Core/middleware'));

module.exports = [
    {
        method: "GET",
        path: "/episode/new/{sessonID}/{channelID}",
        handler: episodes.editView,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Edit Channel",
        }
    },
    {
        method: "GET",
        path: "/episode/new/{sessonID}/",
        handler: episodes.editView,
        config: {
            pre: [{ method: middleware.auth }],
            description: "New Episode",
        }
    },
];
