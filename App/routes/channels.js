const path = require("path");
const channels = require(path.join(__dirname, '../controllers/channelsController'));
const {middleware} = require(path.join(__dirname, '../../Core/middleware'));

module.exports = [
    {
        method: "GET",
        path: "/channels/edit/{channelID}",
        handler: channels.editView,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Edit Channel",
        }
    },
    {
        method: "GET",
        path: "/channels/new/{groupID}",
        handler: channels.editView,
        config: {
            pre: [{ method: middleware.auth }],
            description: "New Channel",
        }
    },
    {
        method: "GET",
        path: "/channels/new/",
        handler: channels.editView,
        config: {
            pre: [{ method: middleware.auth }],
            description: "New Channel",
        }
    },
    {
        method: "POST",
        path: "/channels/edit/{channelID}",
        handler: channels.editSave,
        config: {
            description: "Edit Channel",
        }
    },
    {
        method: "POST",
        path: "/channels/edit/",
        handler: channels.editSave,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Edit Channel",
        }
    },
    {
        method: "GET",
        path: "/channels/delete/{channelID}",
        handler: channels.deleteChannel,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Delete Channel",
        }
    },
    {
        method: "GET",
        path: "/channels/activate/{channelID}",
        handler: channels.activateChannel,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Activate Channel",
        }
    },
];
