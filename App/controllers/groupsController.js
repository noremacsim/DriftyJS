const path = require("path");
const {Groups} = require(path.join(__dirname, '../../Core/models/'));
const {Channels} = require(path.join(__dirname, '../../Core/models/'));


module.exports = {
    view: async(request, h) => {
        const groups = await Groups.findAll(
              {
                  include: {
                      model: Channels,
                  },
                  where: { UserId: global.userID }
                }
            );
        return h.simsView('groups', {groups: groups, activePage: 'playlists'});
    },

    editView: async(request, h) => {
        const groupID = request.params.groupID;
        let group = [];
        if (groupID) {
            group = await Groups.findOne({ where: { id: groupID, UserId: global.userID } });
        }
        return h.simsView('editGroup', {group: group, activePage: 'playlists'});
    },

    editSave: async(request, h) => {
        const groupID = request.params.groupID;
        const {name, mapped} = request.payload;

        if (groupID) {
            await Groups.update(
                {
                    name: name,
                    mapped, mapped,
                },
                {
                    where: {id: groupID, UserId: global.userID}
                }
            );
        } else {
            await Groups.create(
                {
                    name: name,
                    mapped, mapped,
                    UserId: global.userID
                }
            );
        }

        return 'test';
    },

    deleteGroup: async(request, h) => {
        const groupID = request.params.groupID;
        await Channels.destroy({ where: { GroupId: groupID, UserId: global.userID } });
        await Groups.destroy({ where: { id: groupID, UserId: global.userID } });
        return 'test';
    },
};
