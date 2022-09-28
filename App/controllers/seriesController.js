const path = require("path");
const {Groups} = require(path.join(__dirname, '../../Core/models/'));
const {Channels} = require(path.join(__dirname, '../../Core/models/'));
const {Series} = require(path.join(__dirname, '../../Core/models/'));
const {Sessons} = require(path.join(__dirname, '../../Core/models/'));

module.exports = {

    view: async(request, h) => {
        const series = await Series.findAll(
              {
                  include: {
                      model: Sessons,
                  },
                  where: { UserId: global.userID }
                }
            );
        return h.simsView('series', {series: series, activePage: 'series'});
    },

    editView: async(request, h) => {
        const seriesID = request.params.seriesID;
        const groups = await Groups.findAll();
        let series = [];
        if (seriesID) {
            series = await Series.findOne({ where: { id: seriesID, UserId: global.userID } });
        }
        return h.simsView('editSeries', {series: series, groups: groups, activePage: 'series'});
    },

    editSave: async(request, h) => {
        const seriesID = request.params.seriesID;
        let {name, logo, imbdid, group, runtime, plot, backdropImg, coverImg, releaseDate} = request.payload;
        let tvinfo = [];

        if (seriesID) {
            await Series.update(
                {
                    name: name,
                    logo: logo,
                    GroupId: group,
                    imbdid: imbdid ?? null,
                    releaseDate: releaseDate,
                    coverImg: coverImg,
                    backdropImg: backdropImg,
                    plot: plot,
                    runtime: runtime,
                },
                {
                    where: {id: seriesID, UserId: global.userID}
                }
            );
        } else {
            await Series.create(
                {
                  name: name,
                  logo: logo,
                  GroupId: group,
                  imbdid: imbdid ?? null,
                  UserId: global.userID,
                  releaseDate: releaseDate,
                  coverImg: coverImg,
                  backdropImg: backdropImg,
                  plot: plot,
                  runtime: runtime,
                }
            );
        }

        return 'test';
    },

    deleteSeries: async(request, h) => {
        const seriesID = request.params.seriesID;
        //await Channels.destroy({ where: { GroupId: groupID, UserId: global.userID } });
        await Series.destroy({ where: { id: seriesID, UserId: global.userID } });
        return 'test';
    },
};
