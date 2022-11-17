const path = require("path");
const Group = require(path.join(__dirname, '../controllers/groupController'));
const {middleware} = require(path.join(__dirname, '../../Core/middleware'));

module.exports = [
    {
        method: "POST",
        path: "/group/new",
        handler: Group.newGroup,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Create New Group",
        }
    },
    {
        method: "POST",
        path: "/group/user/add",
        handler: Group.addUser,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Assign User to a Group",
        }
    },
    {
        method: "POST",
        path: "/group/user/remove",
        handler: Group.removeUser,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Remove a user from Group",
        }
    },
];
