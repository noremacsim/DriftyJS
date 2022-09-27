const path = require("path");
const {Channels} = require(path.join(__dirname, '../../Core/models/'));
const {Groups} = require(path.join(__dirname, '../../Core/models/'));


module.exports = {
    viewByGroup: async(request, h) => {
        const GroupId = request.params.groupID;

        const channels = await Channels.findAll({
            where: {
                GroupId: GroupId,
                UserId: global.userID,
            },
        });
        const group = await Groups.findOne({ where: { id: GroupId, UserId: global.userID } });

        return h.simsView('channels', {channels: channels, GroupId: GroupId, group: group, activePage: 'playlists'});
    },

    editView: async(request, h) => {
        const channelID = request.params.channelID;
        const groups = await Groups.findAll();
        let groupId = request.params.groupID;
        let channel = [];
        let group = [];

        if (channelID) {
            channel = await Channels.findOne({ where: { id: channelID, UserId: global.userID } });
            group = await Groups.findOne({ where: { id: channel.GroupId, UserId: global.userID } });
        }

        return h.simsView('editChannel', {channel: channel, groupId: groupId, groups: groups, group: group, activePage: 'playlists'});
    },

    editSave: async(request, h) => {
        const channelID = request.params.channelID

        const {name, logo, url, group, tvgid, tvgtype, imbdid} = request.payload;

        if (channelID) {
            await Channels.update(
                {
                    name: name,
                    logo: logo,
                    url: url,
                    GroupId: group,
                    tvgid: tvgid,
                    tvgtype: tvgtype,
                    imbdid: imbdid,
                },
                {
                    where: {id: channelID, UserId: global.userID}
                }
            );
        } else {
            await Channels.create(
                {
                    name: name,
                    logo: logo,
                    url: url,
                    GroupId: group,
                    tvgid: tvgid,
                    tvgtype: tvgtype,
                    imbdid: imbdid,
                    UserId: global.userID,
                }
            );
        }

        return 'test';
    },

    deleteChannel: async(request, h) => {
        const channelID = request.params.channelID
        await Channels.update(
            {
                deleted: true,
            },
            {
                where: { id: channelID, UserId: global.userID }
            }
        );
        return 'test';
    },

    activateChannel: async(request, h) => {
        const channelID = request.params.channelID
        await Channels.update(
            {
                deleted: false,
            },
            {
                where: { id: channelID, UserId: global.userID }
            }
        );
        return 'test';
    },
};
