const path = require("path");
const Public = require(path.join(__dirname, '../controllers/publicController'));
const Boom = require("boom");

module.exports = [
    {
        method: "GET",
        path: "/welcome",
        handler: Public.home,
        config: {
            description: "Welcome Page",
        }
    },
];
