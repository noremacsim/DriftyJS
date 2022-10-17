const path = require("path");
const {Channels} = require(path.join(__dirname, '../../Core/models/'));
const {Sessons} = require(path.join(__dirname, '../../Core/models/'));
const {Groups} = require(path.join(__dirname, '../../Core/models/'));


module.exports = {
    view: async(request, h) => {
        const sessonID = request.params.sessonID;

        const channels = await Channels.findAll({
            where: {
                SessonId: sessonID,
                UserId: global.userID,
            },
        });

        return h.simsView('episodes', {channels: channels, sessonID: sessonID, activePage: 'series'});
    },

    editView: async(request, h) => {
        const channelID = request.params.channelID;
        const seriesID = request.params.seriesID;
        const sessonID = request.params.sessonID;

        const sesson = await Sessons.findOne({
            where: {
                id: sessonID,
                UserId: global.userID,
            },
        });

        let channel = [];

        if (channelID) {
            channel = await Channels.findOne({ where: { id: channelID, UserId: global.userID } });
        }

        return h.simsView('editEpisode', {channel: channel, sessonID: sessonID, seriesID: sesson.SeriesId ?? 0, activePage: 'series'});
    },
};
