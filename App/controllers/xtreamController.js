const http = require('http');
const path = require("path");
const fs = require('fs');
const Boom = require('boom')
const { Readable } = require('stream');
const { Op } = require("sequelize");
const {Groups} = require(path.join(__dirname, '../../Core/models/'));
const {Channels} = require(path.join(__dirname, '../../Core/models/'));
const {Client} = require(path.join(__dirname, '../../Core/models/'));
const {ClientGroups} = require(path.join(__dirname, '../../Core/models/'));

module.exports = {

  playChannel: async (request, h) => {
    const channelID = request.params.channelID;
    const username = request.params.username;
    const password = request.params.password;

    if (username && password) {
      client = await Client.findOne({
        where: {
            username: request.params.username,
            password: request.params.password
          }
      });
    } else {
      return Boom.unauthorized('invalid login');
    }

    if (!client) {
      return Boom.unauthorized('invalid login');
    }

    channels = await Channels.findOne({
        where: {
            id: channelID,
        },
    });

    return h.redirect(channels.url).temporary();
  },

  apk: async (request, h) => {
    let stream = fs.createReadStream(path.join(__dirname, `../Storage/app.apk`));
    let streamData = new Readable().wrap(stream);
    return h.response(streamData)
      .header('Content-Type', 'application/apk')
      .header('Content-Disposition', 'attachment; filename=app.apk');
  },

  xmltv: async (request, h) => {
    if (request.query.username && request.query.password) {

      client = await Client.findOne({
        where: {
            username: request.query.username,
            password: request.query.password
          }
      });

      if (!client) {
        return Boom.unauthorized('invalid login');
      }

      let stream = fs.createReadStream(path.join(__dirname, `../Storage/epg.xml`));
      let streamData = new Readable().wrap(stream);
      return h.response(streamData)
        .header('Content-Type', 'application/xml')
        .header('Content-Disposition', 'attachment; filename=epg.xml');
    } else {
      return Boom.unauthorized('invalid login');
    }
  },

  syncxmltv: async (request, h) => {
    const file = fs.createWriteStream(path.join(__dirname, `../Storage/epg.xml`));
    const epg = http.get("http://tanmedia.watch:8880/xmltv.php?username=mrcameronsim@gmail.com&password=lhE787Y5hu", function(response) {
       response.pipe(file);

       // after download completed close filestream
       file.on("finish", () => {
           file.close();
           console.log("Download Completed");
       });
    }).on('error', function(err) { // Handle errors
      if (cb) cb(err.message);
    });
  },

  player_api: async (request, h) => {
    const dateNow = new Date;
    const dd = dateNow.getDate();
    const mm = dateNow.getMonth()+1;
    const yyyy = dateNow.getFullYear();
    const seconds = dateNow.getSeconds();
    const minutes = dateNow.getMinutes();
    const hour = dateNow.getHours();
    const dateString = `${yyyy}-${mm}-${dd} ${hour}:${minutes}:${seconds}`;
    let vodCategories = [];
    let liveCategories = [];
    let liveChannels = [];
    let vodChannels = [];
    console.log(request.query);
    console.log(request);

    if (typeof request.payload != 'undefined') {
      if (
        (typeof request.payload.username != 'undefined' && typeof request.payload.password != 'undefined') &&
        (!request.query.username && !request.query.password)
      ) {
        request.query = request.payload;
      }
    }

    if (request.query.username && request.query.password) {

      client = await Client.findOne({
        where: {
            username: request.query.username,
            password: request.query.password
          }
      });

      if (!client) {
        return Boom.unauthorized('invalid login');
      }

      let clientCreated = Math.round(new Date(client.createdAt).getTime()/1000);
      let clientExpDate = Math.round(new Date(client.exp_date).getTime()/1000);

      if (request.query.action === 'get_live_categories') {

        clientGroups = await ClientGroups.findAll({ where: { ClientId: client.id }, attributes: ["GroupId"], raw: true, nest: true })
            .then(function(clientGroups) {
                return clientGroups.map(function(clientGroups) { return clientGroups.GroupId; })
            });

        const lives = await Groups.findAll(
          {
            where: {
              type: 'live',
              id: {
                [Op.or]: clientGroups
              }
            }
          }
        );

        for (const live of lives) {
          liveCategories.push(
                {
                  "category_id":live.id,
                  "category_name":live.name,
                  "parent_id":0
                }
              );
        }

        return h.response(liveCategories).code(200);
      }

      if (request.query.action === 'get_vod_categories') {

        clientGroups = await ClientGroups.findAll({ where: { ClientId: client.id }, attributes: ["GroupId"], raw: true, nest: true })
            .then(function(clientGroups) {
                return clientGroups.map(function(clientGroups) { return clientGroups.GroupId; })
            });

        const vods = await Groups.findAll(
          {
            where: {
              type: 'movie',
              id: {
                [Op.or]: clientGroups
              }
            }
          }
        );

        for (const vod of vods) {
          vodCategories.push(
                {
                  "category_id":vod.id,
                  "category_name":vod.name,
                  "parent_id":0
                }
              );
        }

        return h.response(vodCategories).code(200);
      }

      if (request.query.action === 'get_series_categories') {
        return h.response([]).code(200);
      }

      if (request.query.action === 'get_live_streams') {
        console.log(request.query);
        let channels = await Channels.findAll(
          {
              where: {
                  tvgtype: 'live',
              },
          }
        );

        if (request.query.category_id) {
          channels = await Channels.findAll({
              where: {
                  GroupId: request.query.category_id,
                  tvgtype: 'live',
              },
          });
        }

        for (const channel of channels) {
          liveChannels.push(
                {
                  "num":channel.id,
                  "name":channel.name,
                  "stream_type":channel.tvgtype,
                  "stream_id":channel.id,
                  "stream_icon":channel.logo,
                  "epg_channel_id":channel.tvgid,
                  "added":"1641811540",
                  "custom_sid":"",
                  "tv_archive":1,
                  "direct_source":"",
                  "tv_archive_duration":14,
                  "category_id":channel.GroupId,
                  "category_ids":[channel.GroupId],
                  "thumbnail":""
                }
              );
            }

            return h.response(liveChannels).code(200);
        }

      if (request.query.action === 'get_vod_streams') {
          console.log(request.query.category_id);
          let channels = await Channels.findAll(
            {
                where: {
                    tvgtype: 'movie',
                },
            }
          );

          if (request.query.category_id) {
            channels = await Channels.findAll({
                where: {
                    GroupId: request.query.category_id,
                    tvgtype: 'movie',
                },
            });
          }

          for (const channel of channels) {
            vodChannels.push(
                  {
                    "num":channel.id,
                    "name":channel.name,
                    "stream_type":channel.tvgtype,
                    "stream_id":channel.id,
                    "stream_icon":channel.logo,
                    "rating":"",
                    "rating_5based":0,
                    "container_extension":"mp4",
                    "added":"1641811540",
                    "custom_sid":"",
                    "direct_source":"",
                    "category_id":channel.GroupId,
                    "category_ids":[channel.GroupId],
                  }
                );
            }

            return h.response(vodChannels).code(200);
        }

      if (request.query.action === 'get_series') {
        return h.response([]).code(200);
      }

      if (request.query.action === 'get_vod_info') {
        return h.response({}).code(200);
      }

      if (request.query.action === 'get_short_epg') {
        return h.response([]).code(200);
      }

      if (request.query.action === 'get_simple_data_table') {
        return h.response([]).code(200);
      }

      let userInfo = {
          "user_info": {
            "username": client.username,
            "password": client.password,
            "message":"Welcome to SIMS IPTV",
            "auth":1,
            "status":client.active ? 'Active' : 'Suspended',
            "exp_date":clientExpDate,
            "is_trial": client.trial ? 1 : 0,
            "active_cons":"0",
            "created_at":clientCreated,
            "max_connections":"1",
            "allowed_output_formats":["m3u8", "ts"]
          },
          "server_info":{
            "xui":true,
            "version":"1.5.12",
            "revision":2,
            "url":"cameronsim.uk",
            "port":"4101",
            "https_port":"4101",
            "server_protocol":"http",
            "rtmp_port":"4101",
            "timestamp_now": Date.now(),
            "time_now": dateString,
            "timezone":"Europe\/London"
          }
        };

      return h.response(userInfo).code(200);

    } else {
        return Boom.unauthorized('invalid login');
    }
  }
};
