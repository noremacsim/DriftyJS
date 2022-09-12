const path = require("path");
const {Groups} = require(path.join(__dirname, '../../Core/models/'));
const {Channels} = require(path.join(__dirname, '../../Core/models/'));
const {Client} = require(path.join(__dirname, '../../Core/models/'));


module.exports = async (request, h) => {
    const groups = await Groups.findAll({where: { UserId: global.userID }});
    const clients = await Client.findAll({where: { UserId: global.userID }});
    const channels = await Channels.findAll({where: { UserId: global.userID }});
    return h.simsView('home', {channels: channels, clients: clients, groups: groups, activePage: 'home'});
};
