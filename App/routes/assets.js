const path = require("path");

module.exports = [
    {
        method: "GET",
        path: "/assets/css/{file*}",
        handler: {
            directory: {
                path: path.join(__dirname, '../assets/css'),
                listing: true
            }
        }
    },
    {
        method: "GET",
        path: "/assets/img/{file*}",
        handler: {
            directory: {
                path: path.join(__dirname, '../assets/img'),
                listing: true
            }
        }
    },
];