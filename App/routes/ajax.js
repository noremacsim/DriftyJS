const path = require("path");
const ajax = require(path.join(__dirname, '../controllers/ajaxController'));
const {middleware} = require(path.join(__dirname, '../../Core/middleware'));

module.exports = [
    {
        method: ['GET', 'POST'],
        path: "/ajax/search",
        handler: ajax.globalSearch,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Global Channel Search",
        }
    }
];
