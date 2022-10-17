const path = require("path");
const Settings = require(path.join(__dirname, '../controllers/settingsController'));
const {middleware} = require(path.join(__dirname, '../../Core/middleware'));

module.exports = [
    {
        method: "GET",
        path: "/settings",
        handler: Settings.home,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Settings Home Page",
        }
    },
];
