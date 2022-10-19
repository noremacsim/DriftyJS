const path = require("path");
const xtream = require(path.join(__dirname, '../controllers/xtreamController'));
const emby = require(path.join(__dirname, '../controllers/embyController'));
const {middleware} = require(path.join(__dirname, '../../Core/middleware'));

module.exports = [
    {
        method: ['GET', 'POST'],
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
        path: '/{TYPE}/{username}/{password}/{channelID}.m3u8',
        handler: xtream.playChannel,
        config: {
            description: "xtream stream m3u8",
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
    {
        method: "GET",
        path: '/{username}/{password}/{channelID}',
        handler: xtream.playChannel,
        config: {
            description: "xtream stream any",
        }
    },
    {
        method: "GET",
        path: '/hls/{ID}',
        handler: xtream.playHls,
        config: {
            description: "xtream stream hls",
        }
    },
    {
        method: "GET",
        path: "/{username}/{password}/m3u8/{type}/{file}",
        handler: xtream.playm3u8
    },
    {
        method: "GET",
        path: "/import/tvshows",
        handler: xtream.importTvShows,
        config: {
            pre: [{ method: middleware.auth }],
        }
    },
    {
        method: "GET",
        path: "/import/recentmovies",
        handler: xtream.updateRecentMovies,
        config: {
            pre: [{ method: middleware.auth }],
        }
    },
    {
        method: "GET",
        path: "/import/movies/{type}",
        handler: xtream.importMovies,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Import Movie Data",
        }
    },
    {
        method: "GET",
        path: "/emby/generate/movies",
        handler: emby.generateStrmMovies,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Genarate Movie Data strm",
        }
    },
    {
        method: "GET",
        path: "/emby/generate/tvshows",
        handler: emby.generateStrmTvShows,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Genarate tv show Data strm",
        }
    },
];
