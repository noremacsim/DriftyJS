const path = require("path");
const channels = require(path.join(__dirname, '../controllers/channelsController'));

module.exports = [
    {
        method: "GET",
        path: "/channels/edit/{channelID}",
        handler: channels.editView,
        config: {
            description: "Edit Channel",
        }
    },
    {
        method: "GET",
        path: "/channels/new/{groupID}",
        handler: channels.editView,
        config: {
            description: "New Channel",
        }
    },
    {
        method: "GET",
        path: "/channels/new/",
        handler: channels.editView,
        config: {
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
            description: "Edit Channel",
        }
    },
    {
        method: "GET",
        path: "/channels/delete/{channelID}",
        handler: channels.deleteChannel,
        config: {
            description: "Delete Channel",
        }
    },
];