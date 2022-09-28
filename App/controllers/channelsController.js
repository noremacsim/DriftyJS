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

        const {name, logo, url, group, tvgid, tvgtype, imbdid, episode, SessonId, SeriesId, releaseDate, plot, runtime, coverImg} = request.payload;

        if (SeriesId) {
          parseInt(SeriesId)
        }

        if (SessonId) {
          parseInt(SessonId)
        }

        if (channelID) {
            await Channels.update(
                {
                    name: name ?? null,
                    logo: logo ?? null,
                    url: url ?? null,
                    GroupId: group ?? null,
                    tvgid: tvgid ?? null,
                    tvgtype: tvgtype ?? null,
                    imbdid: imbdid ?? null,
                    episode: episode ?? null,
                    releaseDate: releaseDate ?? null,
                    plot: plot ?? null,
                    runtime: runtime ?? null,
                    coverImg: coverImg ?? null,
                    SeriesId: SeriesId ?? null,
                    SessonId: SessonId ?? null,
                },
                {
                    where: {id: channelID, UserId: global.userID}
                }
            );
        } else {
            await Channels.create(
                {
                    name: name ?? null,
                    logo: logo ?? null,
                    url: url ?? null,
                    GroupId: group ?? null,
                    tvgid: tvgid ?? null,
                    tvgtype: tvgtype ?? null,
                    imbdid: imbdid ?? null,
                    episode: episode ?? null,
                    releaseDate: releaseDate ?? null,
                    plot: plot ?? null,
                    runtime: runtime ?? null,
                    coverImg: coverImg ?? null,
                    SeriesId: SeriesId ?? null,
                    SessonId: SessonId ?? null,
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
