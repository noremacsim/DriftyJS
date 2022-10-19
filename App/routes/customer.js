const path = require("path");
const Customer = require(path.join(__dirname, '../controllers/customerController'));
const {middleware} = require(path.join(__dirname, '../../Core/middleware'));

module.exports = [
    {
        method: "GET",
        path: "/videoPlayer",
        handler: Customer,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Home Page",
        }
    },
]
