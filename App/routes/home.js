const path = require("path");
const User = require(path.join(__dirname, '../controllers/userController'));
const {middleware} = require(path.join(__dirname, '../../Core/middleware'));

module.exports = [
    {
        method: "POST",
        path: "/user",
        handler: User.login,
        config: {
            description: "Login User",
        }
    },
];
