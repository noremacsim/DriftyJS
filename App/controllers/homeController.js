const path = require("path");
const {Groups} = require(path.join(__dirname, '../../Core/models/'));
const {Channels} = require(path.join(__dirname, '../../Core/models/'));
const {Client} = require(path.join(__dirname, '../../Core/models/'));


module.exports = async (request, h) => {
    const groups = await Groups.findAll();
    const clients = await Client.findAll();
    const channels = await Channels.findAll();
    return h.view('home', {channels: channels, clients: clients, groups: groups, activePage: 'home'});
};
