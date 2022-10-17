const path = require("path");
const { Op } = require("sequelize");
const {Groups} = require(path.join(__dirname, '../../Core/models/'));
const {Channels} = require(path.join(__dirname, '../../Core/models/'));


module.exports = {
    movies: async(request, h) => {
        const groups = await Groups.findAll(
              {
                  include: {
                      model: Channels,
                  },
                  where: {
                    UserId: global.userID,
                    type: 'movies'
                  }
                }
            );
        return h.simsView('groups', {groups: groups, type: 'movies', activePage: 'movies'});
    },

    live: async(request, h) => {
        const groups = await Groups.findAll(
              {
                  include: {
                      model: Channels,
                  },
                  where: {
                    UserId: global.userID,
                    type: 'live'
                  }
                }
            );
        return h.simsView('groups', {groups: groups, type: 'live', activePage: 'live'});
    },

    series: async(request, h) => {
        const groups = await Groups.findAll(
              {
                  include: {
                      model: Channels,
                  },
                  where: {
                    UserId: global.userID,
                    type: 'series'
                  }
                }
            );
        return h.simsView('groups', {groups: groups, type: 'series', activePage: 'series'});
    },

    editView: async(request, h) => {
        const groupID = request.params.groupID;
        const type = request.params.type;

        let group = [];
        if (groupID) {
            group = await Groups.findOne({ where: { id: groupID, UserId: global.userID } });
        }
        return h.simsView('editGroup', {group: group, type: type, activePage: type});
    },

    editSave: async(request, h) => {
        const groupID = request.params.groupID;
        let {name, mapped, VOD, type} = request.payload;

        if (!VOD) {
          VOD = 0;
        }

        if (groupID) {
            await Groups.update(
                {
                    name: name,
                    mapped: mapped,
                    VOD: VOD,
                    type: type,
                },
                {
                    where: {id: groupID, UserId: global.userID}
                }
            );
        } else {
            await Groups.create(
                {
                    name: name,
                    mapped: mapped,
                    VOD: VOD,
                    UserId: global.userID,
                    type: type,
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

    //Types: movies, series, live
    findOrCreate: async(group, type) => {
      return new Promise(async (resolve, reject) => {
        let vod = 1;
        if (type == 'live') {
          vod = 0;
        }

        let groups = await Groups.findOne({
            where: {
              type: type,
              [Op.or]: [
                  { name: group },
                  { mapped: group },
                ]
            }
        });

        if (groups) {
          return resolve(groups);
        }

        groups = await Groups.create(
            {
                name: group,
                mapped: null,
                VOD: vod,
                UserId: 1,
                type: type,
            }
        );

        return resolve(groups);
      });
    },
};
