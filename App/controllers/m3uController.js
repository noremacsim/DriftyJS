const parser = require('iptv-playlist-parser');
const path = require("path");
const fs = require('fs');
const {Channels} = require(path.join(__dirname, '../../Core/models/'));
const {Settings} = require(path.join(__dirname, '../../Core/models/'));
const {Groups} = require(path.join(__dirname, '../../Core/models/'));
const {ClientGroups} = require(path.join(__dirname, '../../Core/models/'));
const {Client} = require(path.join(__dirname, '../../Core/models/'));
const { Op } = require("sequelize");

module.exports = {
    parseToDB: async(request, h) => {

        async function addGroup(group) {
            const groups = await Groups.findOne({
                where: {
                  [Op.or]: [
                      { name: group },
                      { mapped: group }
                    ]
                }
            });
            return groups;
        }

        async function addChannels(channels) {
            let group = ''; // channel->group->title
            let groupTitle = '';
            let skipTVShows = false;
            let tvShowRegex = new RegExp("[Ss][0-9]{2}[Ee][0-9]{2}");

            const settings = await Settings.findAll({where: {type: 'TVShows'}});

            if (!settings.Active) {
              skipTVShows = true;
            }


           for (const channel of channels) {
             if (channel.group['title'] !== groupTitle) {
               group = await addGroup(channel.group['title']);
               groupTitle = channel.group['title']
             }

              //TODO: If group doesn't exist don't addGroup Can probably think of a way to overide this for a full import ui side
              if (!group) {
                continue;
              }

              if (skipTVShows) {
                if (tvShowRegex.test(channel.name)) {
                    continue;
                }
              }

              await Channels.update({
                tvgid: channel.tvg['id'],
              }, {
                where: { name: channel.name, GroupId: group.id }
              });
          }

           return true;
        };

        const data = request.payload.filepond[1];
        if (data) {
            const m3uFile = fs.readFileSync(data.path, 'utf-8');
            const result = await parser.parse(m3uFile);
            const channels = result.items;
            await addChannels(channels);
            return h.response(result).code(200)
        }

        return h.response('no File').code(400);
    },

    // TODO: Add Options to hide channels and groups for certain users.
    downloadM3u: async(request, h) => {
        const clients = await Client.findAll();

        async function createM3uGroups(group, active = true) {
            let string = '';
            const channels = await Channels.findAll({where: {groupID: group.id, deleted: false}});
            for (const channel of channels) {
                string += `#EXTINF:-1 tvg-id="${channel.tvgid}" tvg-name="${channel.name}" tvg-type="${channel.tvgtype}" tvg-logo="${channel.logo}" group-title="${group.name}",${channel.name} \n`;
                if (!active) {
                  string += 'https://drive.google.com/uc?export=download&id=15INXyplB6vc7Mu00jtZvbJpr7pxyMOJH' + '\n';
                } else {
                  string += channel.url + '\n';
                }
            }
            return string;
        }

        for (const client of clients) {
          let clientID = client.id;
          let username = client.username;
          let stream = fs.createWriteStream(path.join(__dirname, `../Storage/${username}.m3u`));

          let clientGroups = await ClientGroups.findAll({ where: { ClientId: clientID }, attributes: ["GroupId"], raw: true, nest: true })
              .then(function(clientGroups) {
                  return clientGroups.map(function(clientGroups) { return clientGroups.GroupId; })
              });

          stream.write('#EXTM3U url-tvg="http://m3u4u.com/epg/4z2xnjw6jqad9gwvyv15" \n');

          let groups = await Groups.findAll();
          for (const group of groups) {
              if (clientGroups.includes(group.id)) {
                  let string = await createM3uGroups(group, client.active);
                  stream.write(string);
              }
          }
          stream.end();
        }

        return 'done';
    },
}
