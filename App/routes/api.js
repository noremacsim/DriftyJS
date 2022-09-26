const path = require("path");
const xtream = require(path.join(__dirname, '../controllers/xtreamController'));

module.exports = [
    {
        method: "GET",
        path: "/player_api.php",
        handler: xtream.player_api,
        config: {
            description: "xtream api service",
        }
    },
    {
        method: "GET",
        path: "/xmltv.php",
        handler: xtream.xmltv,
        config: {
            description: "EPG Data",
        }
    },
    {
        method: "GET",
        path: "/epg",
        handler: xtream.syncxmltv,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Download EPG Data",
        }
    },
    {
        method: "GET",
        path: '/{TYPE}/{username}/{password}/{channelID}.ts',
        handler: xtream.playChannel,
        config: {
            description: "xtream stream ts",
        }
    },
    {
        method: "GET",
        path: '/{TYPE}/{username}/{password}/{channelID}.mp4',
        handler: xtream.playChannel,
        config: {
            description: "xtream stream mp4",
        }
    },
];
