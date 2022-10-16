const path = require("path");
const { Op } = require("sequelize");
const {Groups} = require(path.join(__dirname, '../../Core/models/'));
const {Channels} = require(path.join(__dirname, '../../Core/models/'));
const {Series} = require(path.join(__dirname, '../../Core/models/'));
const {Sessons} = require(path.join(__dirname, '../../Core/models/'));
const {ChannelGroups} = require(path.join(__dirname, '../../Core/models/'));

module.exports = {

    viewByGroup: async(request, h) => {
        const GroupId = request.params.groupID;

        channelGroups = await ChannelGroups.findAll({ where: { GroupId: GroupId }, attributes: ["ChannelId"], raw: true, nest: true })
            .then(function(channelGroups) {
                return channelGroups.map(function(channelGroups) { return channelGroups.ChannelId; })
            });

        const movies = await Channels.findAll(
              {
                where: {
                  tvgtype: 'movies',
                  UserId: global.userID,
                  id: {
                    [Op.or]: channelGroups
                  }
                }
              }
          );

        return h.simsView('movies', {channels: movies, GroupId: GroupId, activePage: 'movies'});
    },

    view: async(request, h) => {
        const movies = await Channels.findAll(
              {
                where: { tvgtype: 'movie', UserId: global.userID }
              }
          );
        return h.simsView('movies', {channels: movies, activePage: 'movies'});
    },

    editView: async(request, h) => {
        const movieID = request.params.movieID;
        const groupID = request.params.groupID;
        const groups = await Groups.findAll({ where: { type: 'movies' }});
        let channelGroups = [];

        if (movieID) {
          channelGroups = await ChannelGroups.findAll({ where: { ChannelId: movieID }, attributes: ["GroupId"], raw: true, nest: true })
              .then(function(channelGroups) {
                  return channelGroups.map(function(channelGroups) { return channelGroups.GroupId; })
              });
        }

        let channel = [];
        let group = [];

        if (movieID) {
            channel = await Channels.findOne({ where: { id: movieID, UserId: global.userID } });
        }

        return h.simsView('editMovie', {channel: channel, type: 'movies', groupID: groupID, channelGroups: channelGroups, groups: groups, activePage: 'movies'});
    },
};
