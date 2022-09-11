const path = require("path");
const groups = require(path.join(__dirname, '../controllers/groupsController'));
const channels = require(path.join(__dirname, '../controllers/channelsController'));

module.exports = [
    {
        method: "GET",
        path: "/groups",
        handler: groups.view,
        config: {
            description: "Gets all the groups available",
        }
    },
    {
        method: "GET",
        path: "/groups/{groupID}",
        handler: channels.viewByGroup,
        config: {
            description: "Gets all the channels available in group",
        }
    },
    {
        method: "GET",
        path: "/groups/edit/{groupID}",
        handler: groups.editView,
        config: {
            description: "Edit Group",
        }
    },
    {
        method: "POST",
        path: "/groups/edit/{groupID}",
        handler: groups.editSave,
        config: {
            description: "Save Group",
        }
    },
    {
        method: "POST",
        path: "/groups/edit/",
        handler: groups.editSave,
        config: {
            description: "Save Group",
        }
    },
    {
        method: "GET",
        path: "/groups/delete/{groupID}",
        handler: groups.deleteGroup,
        config: {
            description: "Delete Group",
        }
    },
    {
        method: "GET",
        path: "/groups/edit/",
        handler: groups.editView,
        config: {
            description: "New Group",
        }
    },
];