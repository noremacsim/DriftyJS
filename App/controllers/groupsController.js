const path = require("path");
const {Groups} = require(path.join(__dirname, '../../Core/models/'));


module.exports = {
    view: async(request, h) => {
        const groups = await Groups.findAll(
            {
                    include: [
                        'Channels'
                    ]
                }
            );
        return h.simsView('groups', {groups: groups, activePage: 'playlists'});
    },

    editView: async(request, h) => {
        const groupID = request.params.groupID;
        let group = [];
        if (groupID) {
            group = await Groups.findOne({ where: { id: groupID } });
        }
        return h.simsView('editGroup', {group: group, activePage: 'playlists'});
    },

    editSave: async(request, h) => {
        const groupID = request.params.groupID;
        const {name} = request.payload;

        if (groupID) {
            await Groups.update(
                {
                    name: name
                },
                {
                    where: {id: groupID}
                }
            );
        } else {
            await Groups.create(
                {
                    name: name,
                }
            );
        }

        return 'test';
    },

    deleteGroup: async(request, h) => {
        const groupID = request.params.groupID;
        await Groups.destroy({ where: { id: groupID } });
        return 'test';
    },
};