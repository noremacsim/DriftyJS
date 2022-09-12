const path = require("path");
const Client = require(path.join(__dirname, '../controllers/clientController'));
const {middleware} = require(path.join(__dirname, '../../Core/middleware'));

module.exports = [
    {
        method: "GET",
        path: "/clients",
        handler: Client.view,
        config: {
            pre: [{ method: middleware.auth }],
            description: "view Clients",
        }
    },
    {
        method: "GET",
        path: "/clients/edit/{clientID}",
        handler: Client.edit,
        config: {
            pre: [{ method: middleware.auth }],
            description: "edit Client",
        }
    },
    {
        method: "GET",
        path: "/clients/edit/",
        handler: Client.edit,
        config: {
            pre: [{ method: middleware.auth }],
            description: "New User",
        }
    },
    {
        method: "POST",
        path: "/clients/edit/{clientID}",
        handler: Client.saveEdit,
        config: {
            pre: [{ method: middleware.auth }],
            description: "edit User",
        }
    },
    {
        method: "GET",
        path: "/clients/delete/{clientID}",
        handler: Client.deleteUser,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Delete User",
        }
    },
    {
        method: "POST",
        path: "/clients/edit/",
        handler: Client.saveEdit,
        config: {
            pre: [{ method: middleware.auth }],
            description: "New User",
        }
    },
];
