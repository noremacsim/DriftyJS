const path = require("path");
const {Groups} = require(path.join(__dirname, '../../Core/models/'));
const {Channels} = require(path.join(__dirname, '../../Core/models/'));
const {Series} = require(path.join(__dirname, '../../Core/models/'));
const {Sessons} = require(path.join(__dirname, '../../Core/models/'));

module.exports = {

    viewByGroup: async(request, h) => {
        const GroupId = request.params.groupID;

        const movies = await Channels.findAll(
              {
                where: { tvgtype: 'movies', UserId: global.userID, GroupId: GroupId }
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
        const groups = await Groups.findAll();

        let channel = [];
        let group = [];

        if (movieID) {
            channel = await Channels.findOne({ where: { id: movieID, UserId: global.userID } });
        }

        return h.simsView('editMovie', {channel: channel, type: 'movies', groupID: groupID, activePage: 'movies'});
    },
};
