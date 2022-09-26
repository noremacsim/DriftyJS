const path = require("path");
const xtream = require(path.join(__dirname, '../controllers/xtreamController'));
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
        path: '/{any*}',
        handler: (request, h) => {
          const accept = request.headers.accept

          console.log(request);
          return 'done';
        }
    },
    {
        method: "POST",
        path: '/{any*}',
        handler: (request, h) => {
          const accept = request.headers.accept

          console.log(request);
          return 'done';
        }
    },
];
