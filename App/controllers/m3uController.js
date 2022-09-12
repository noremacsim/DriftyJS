const parser = require('iptv-playlist-parser');
const path = require("path");
const fs = require('fs');
const {Channels} = require(path.join(__dirname, '../../Core/models/'));
const {Groups} = require(path.join(__dirname, '../../Core/models/'));
const {ClientGroups} = require(path.join(__dirname, '../../Core/models/'));
const {Client} = require(path.join(__dirname, '../../Core/models/'));

module.exports = {
    parseToDB: async(request, h) => {

        async function addGroup(group) {
            const [groups, created] = await Groups.findOrCreate({
                where: { name: group },
                defaults: {
                    name: group,
                    UserId: global.userID
                }
            });
            return groups;
        }

        async function addChannels(channels) {
            let group = ''; // channel->group->title

             for (const channel of channels) {
                group = await addGroup(channel.group['title']);
                await Channels.create(
                    {
                        name: channel.name,
                        tvgid: channel.tvg['id'],
                        logo: channel.tvg['logo'],
                        url: channel.url,
                        GroupId: group.id,
                        UserId: global.userID,
                    }
                );
            }
        };


        const m3uFile = fs.readFileSync(path.join(__dirname, '../Storage/cameronsim.m3u'), 'utf-8')
        const result = parser.parse(m3uFile);
        const channels = result.items;
        addChannels(channels);
        return h.response(result).code(200)
    },

    // TODO: Add Options to hide channels and groups for certain users.
    downloadM3u: async(request, h) => {
        const clientID = request.params.clientID;
        const client = await Client.findOne({ where: { id: clientID } });
        const username = client.username;

        const stream = fs.createWriteStream(path.join(__dirname, `../Storage/${username}.m3u`));

        async function createM3uGroups(group) {
            let string = '';
            const channels = await Channels.findAll({where: {groupID: group.id}});
            for (const channel of channels) {
                string += `#EXTINF:-1 tvg-id="${channel.tvgid}" tvg-name="${channel.name}" tvg-logo="${channel.logo}" group-title="${group.name}",${channel.name} \n`;
                string += channel.url + '\n';
            }
            return string;
        }

        const clientGroups = await ClientGroups.findAll({ where: { ClientId: clientID }, attributes: ["GroupId"], raw: true, nest: true })
            .then(function(clientGroups) {
                return clientGroups.map(function(clientGroups) { return clientGroups.GroupId; })
            });

        stream.write('#EXTM3U url-tvg="http://m3u4u.com/epg/4z2xnjw6jqad9gwvyv15" \n');

        const groups = await Groups.findAll();
        for (const group of groups) {
            if (clientGroups.includes(group.id)) {
                let string = await createM3uGroups(group);
                stream.write(string);
            }
        }
        stream.end();

        await stream.on('finish', async function () {
            return h.file(path.join(__dirname, `../Storage/${username}.m3u`));
        });

        return h.file(path.join(__dirname, `../Storage/${username}.m3u`));
    },
}
