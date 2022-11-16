const path = require("path");
const User = require(path.join(__dirname, '../controllers/userController'));
const {middleware} = require(path.join(__dirname, '../../Core/middleware'));

module.exports = [
    {
        method: "POST",
        path: "/user/login",
        handler: User.login,
        config: {
            description: "Login User",
        }
    },
    {
        method: "POST",
        path: "/user/logout",
        handler: User.logout,
        config: {
            description: "Logout User",
        }
    },
    {
        method: "POST",
        path: "/user/register",
        handler: User.register,
        config: {
            description: "Register User",
        }
    },
    {
        method: "GET",
        path: "/user",
        handler: User.details,
        config: {
            pre: [{ method: middleware.auth }],
            description: "User Details",
        }
    },
    {
        method: "GET",
        path: "/user/2fa/new",
        handler: User.new2Fa,
        config: {
            pre: [{ method: middleware.auth }],
            description: "User Details",
        }
    },
    {
        method: "POST",
        path: "/user/2fa/validate",
        handler: User.enable2Fa,
        config: {
            pre: [{ method: middleware.twofaCheck }],
            description: "User Details",
        }
    },
    {
        method: "GET",
        path: "/user/login",
        handler: User.signinView,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Login User",
        }
    },
];
