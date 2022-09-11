const path = require("path");
const {Channels} = require(path.join(__dirname, '../../Core/models/'));
const {Groups} = require(path.join(__dirname, '../../Core/models/'));


module.exports = {
    viewByGroup: async(request, h) => {
        const GroupId = request.params.groupID;

        const channels = await Channels.findAll({
            where: {
                GroupId: GroupId
            },
        });
        const group = await Groups.findOne({ where: { id: GroupId } });

        return h.view('channels', {channels: channels, GroupId: GroupId, group: group, activePage: 'playlists'});
    },

    editView: async(request, h) => {
        const channelID = request.params.channelID;
        const groups = await Groups.findAll();
        let groupId = request.params.groupID;
        let channel = [];
        let group = [];

        if (channelID) {
            channel = await Channels.findOne({ where: { id: channelID } });
            group = await Groups.findOne({ where: { id: channel.GroupId } });
        }

        return h.view('editChannel', {channel: channel, groupId: groupId, groups: groups, group: group, activePage: 'playlists'});
    },

    editSave: async(request, h) => {
        const channelID = request.params.channelID

        const {name, logo, url, group} = request.payload;

        if (channelID) {
            await Channels.update(
                {
                    name: name,
                    logo: logo,
                    url: url,
                    GroupId: group,
                },
                {
                    where: {id: channelID}
                }
            );
        } else {
            await Channels.create(
                {
                    name: name,
                    logo: logo,
                    url: url,
                    GroupId: group,
                }
            );
        }

        return 'test';
    },

    deleteChannel: async(request, h) => {
        const channelID = request.params.channelID
        await Channels.destroy({ where: { id: channelID } });
        return 'test';
    },
};