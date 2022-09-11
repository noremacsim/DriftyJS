const path = require("path");
const User = require(path.join(__dirname, '../controllers/userController'));

module.exports = [
    {
        method: "GET",
        path: "/users",
        handler: User.view,
        config: {
            description: "view Users",
        }
    },
    {
        method: "GET",
        path: "/users/edit/{userID}",
        handler: User.edit,
        config: {
            description: "edit User",
        }
    },
    {
        method: "GET",
        path: "/users/edit/",
        handler: User.edit,
        config: {
            description: "New User",
        }
    },
    {
        method: "POST",
        path: "/users/edit/{userID}",
        handler: User.saveEdit,
        config: {
            description: "edit User",
        }
    },
    {
        method: "GET",
        path: "/users/delete/{userID}",
        handler: User.deleteUser,
        config: {
            description: "Delete User",
        }
    },
    {
        method: "POST",
        path: "/users/edit/",
        handler: User.saveEdit,
        config: {
            description: "New User",
        }
    },
];