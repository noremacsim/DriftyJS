const path = require("path");
const User = require(path.join(__dirname, '../controllers/userController'));

module.exports = [
    {
        method: "POST",
        path: "/login",
        handler: User.login,
        config: {
            description: "Login User",
        }
    },
    {
        method: "GET",
        path: "/login",
        handler: User.signinView,
        config: {
            description: "Login User",
        }
    },
    {
        method: "POST",
        path: "/register",
        handler: User.register,
        config: {
            description: "Register User",
        }
    },
];
