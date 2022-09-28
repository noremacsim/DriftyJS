const path = require("path");
const {Groups} = require(path.join(__dirname, '../../Core/models/'));
const {Channels} = require(path.join(__dirname, '../../Core/models/'));
const {Series} = require(path.join(__dirname, '../../Core/models/'));
const {Sessons} = require(path.join(__dirname, '../../Core/models/'));

module.exports = {

    view: async(request, h) => {
        const seriesID = request.params.seriesID;

        const sessons = await Sessons.findAll(
              {
                  include: {
                      model: Channels,
                  },
                  where: { SeriesId: seriesID, UserId: global.userID }
                }
            );
        return h.simsView('sessons', {sessons: sessons, seriesID: seriesID, activePage: 'series'});
    },

    editView: async(request, h) => {
        const sessonsID = request.params.sessonID;
        const seriesID = request.params.seriesID;


        let sessons = [];
        if (sessonsID) {
            sessons = await Sessons.findOne({ where: { id: sessonsID, UserId: global.userID } });
        }
        return h.simsView('editSessons', {sessons: sessons, seriesID: seriesID, activePage: 'series'});
    },

    editSave: async(request, h) => {
        const seriesID = request.params.seriesID;
        const sessonsID = request.params.sessonID;

        let {name, logo, imbdid, SeriesId, season, episodes, overview, coverImg} = request.payload;

        if (sessonsID) {
            await Sessons.update(
                {
                    name: name,
                    logo: logo,
                    SeriesId: seriesID,
                    imbdid: imbdid,
                    season: season,
                    episodes: episodes,
                    overview: overview,
                    coverImg: coverImg,
                },
                {
                    where: {id: sessonsID, UserId: global.userID}
                }
            );
        } else {
            await Sessons.create(
                {
                  name: name,
                  logo: logo,
                  SeriesId: seriesID,
                  imbdid: imbdid,
                  season: season,
                  episodes: episodes,
                  overview: overview,
                  coverImg: coverImg,
                  UserId: global.userID
                }
            );
        }

        return 'test';
    },

    deleteSessons: async(request, h) => {
        const sessonsID = request.params.sessonID;
        //await Channels.destroy({ where: { GroupId: groupID, UserId: global.userID } });
        await Sessons.destroy({ where: { id: sessonsID, UserId: global.userID } });
        return 'test';
    },
};
