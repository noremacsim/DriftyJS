const path = require("path");
const {Groups} = require(path.join(__dirname, '../../Core/models/'));
const {Channels} = require(path.join(__dirname, '../../Core/models/'));
const {User} = require(path.join(__dirname, '../../Core/models/'));


module.exports = async (request, h) => {
    const groups = await Groups.findAll();
    const users = await User.findAll();
    const channels = await Channels.findAll();
    return h.view('home', {channels: channels, users: users, groups: groups, activePage: 'home'});
};