const parser = require('iptv-playlist-parser');
const path = require("path");
const fs = require('fs');
const {Channels} = require(path.join(__dirname, '../../Core/models/'));
const {Groups} = require(path.join(__dirname, '../../Core/models/'));
const {UserGroups} = require(path.join(__dirname, '../../Core/models/'));
const {User} = require(path.join(__dirname, '../../Core/models/'));

module.exports = {
    parseToDB: async(request, h) => {

        async function addGroup(group) {
            const [groups, created] = await Groups.findOrCreate({
                where: { name: group },
                defaults: {
                    name: group
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
        const userID = request.params.userID;
        const user = await User.findOne({ where: { id: userID } });
        const username = user.username;

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

        const userGroups = await UserGroups.findAll({ where: { UserId: userID }, attributes: ["GroupId"], raw: true, nest: true })
            .then(function(userGroups) {
                return userGroups.map(function(userGroups) { return userGroups.GroupId; })
            });

        stream.write('#EXTM3U url-tvg="http://m3u4u.com/epg/4z2xnjw6jqad9gwvyv15" \n');

        const groups = await Groups.findAll();
        for (const group of groups) {
            if (userGroups.includes(group.id)) {
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
