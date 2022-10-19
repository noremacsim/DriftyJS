const path = require("path");
const moment = require('moment');
const { Op } = require('sequelize')
const {Groups} = require(path.join(__dirname, '../../Core/models/'));
const {Channels} = require(path.join(__dirname, '../../Core/models/'));
const {Client} = require(path.join(__dirname, '../../Core/models/'));
const {RecentlyPlayed} = require(path.join(__dirname, '../../Core/models/'));

module.exports = async (request, h) => {
    return h.simsView('videoplayer', {
      activePage: 'home',
    });
};
