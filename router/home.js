const path = require("path");
const Home = require(path.join(__dirname, '../controllers/homeController'));

module.exports = [
    {
        method: "GET",
        path: "/",
        handler: Home,
        config: {
            description: "Gets all the notes available"
        }
    },
];