const path = require("path");
const {Groups} = require(path.join(__dirname, '../../Core/models/'));
const {Channels} = require(path.join(__dirname, '../../Core/models/'));
const {Series} = require(path.join(__dirname, '../../Core/models/'));
const {Sessons} = require(path.join(__dirname, '../../Core/models/'));

module.exports = {

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
        const groups = await Groups.findAll();

        let channel = [];
        let group = [];

        if (movieID) {
            channel = await Channels.findOne({ where: { id: movieID, UserId: global.userID } });
            group = await Groups.findOne({ where: { id: channel.GroupId, UserId: global.userID } });
        }

        return h.simsView('editMovie', {channel: channel, groups: groups, group: group, activePage: 'movies'});
    },
};
