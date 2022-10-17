const path = require("path");
const moment = require('moment');
const { Op } = require('sequelize')
const {Groups} = require(path.join(__dirname, '../../Core/models/'));
const {Channels} = require(path.join(__dirname, '../../Core/models/'));
const {Client} = require(path.join(__dirname, '../../Core/models/'));
const {RecentlyPlayed} = require(path.join(__dirname, '../../Core/models/'));
module.exports = async (request, h) => {

    function timeConverter() {
      var a = new Date();
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var year = a.getFullYear();
      var month = ("00" + (parseInt(a.getMonth()) + 1)).slice(-2);
      var date = ("00" + a.getDate()).slice(-2);
      var hour = ("00" + a.getHours()).slice(-2);
      var min = ("00" + (parseInt(a.getMinutes()) - 5)).slice(-2);
      var sec = ("00" + a.getSeconds()).slice(-2);
      var time = year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec ;
      return time;
    }

    const groups = await Groups.findAll({where: { UserId: global.userID }});
    const clients = await Client.findAll({where: { UserId: global.userID }});
    const channels = await Channels.findAll({where: { UserId: global.userID }});
    const recentlyPlayed = await RecentlyPlayed.findAll({
        include: Client,
        order: [['updatedAt', 'DESC']]
    });
    const activeClient = await RecentlyPlayed.findAll({
      include: Client,
      where: {
        updatedAt: {
          [Op.gte]: timeConverter()
        }
      },
      group: "ClientId",
    });

    return h.simsView('home', {
      moment: moment,
      channels: channels,
      clients: clients,
      groups: groups,
      recentlyPlayed: recentlyPlayed,
      activeClient: activeClient,
      activePage: 'home'
    });
};
