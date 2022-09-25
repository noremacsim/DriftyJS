const path = require("path");
const Settings = require(path.join(__dirname, '../controllers/settingsController'));

module.exports = [
    {
        method: "GET",
        path: "/settings",
        handler: Settings.home,
        config: {
            description: "Settings Home Page",
        }
    },
];
