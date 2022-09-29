const path = require("path");
const groups = require(path.join(__dirname, '../controllers/groupsController'));
const channels = require(path.join(__dirname, '../controllers/channelsController'));
const {middleware} = require(path.join(__dirname, '../../Core/middleware'));

module.exports = [
    {
        method: "GET",
        path: "/groups/{groupID}",
        handler: channels.viewByGroup,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Gets all the channels available in group",
        }
    },
    {
        method: "GET",
        path: "/groups/{type}/edit/{groupID}",
        handler: groups.editView,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Edit Group",
        }
    },
    {
        method: "POST",
        path: "/groups/edit/{groupID}",
        handler: groups.editSave,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Save Group",
        }
    },
    {
        method: "POST",
        path: "/groups/edit/",
        handler: groups.editSave,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Save Group",
        }
    },
    {
        method: "GET",
        path: "/groups/delete/{groupID}",
        handler: groups.deleteGroup,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Delete Group",
        }
    },
    {
        method: "GET",
        path: "/groups/{type}/edit/",
        handler: groups.editView,
        config: {
            pre: [{ method: middleware.auth }],
            description: "New Group",
        }
    },
];
