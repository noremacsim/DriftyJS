const http = require('http');
const https = require('https');
const path = require("path");
const fs = require('fs');
const Boom = require('boom');
const util = require('util');
const getJSON = require('get-json')
const { Readable } = require('stream');
const { Op } = require("sequelize");
const {Groups} = require(path.join(__dirname, '../../Core/models/'));
const {Channels} = require(path.join(__dirname, '../../Core/models/'));
const {Client} = require(path.join(__dirname, '../../Core/models/'));
const {ClientGroups} = require(path.join(__dirname, '../../Core/models/'));

module.exports = {

  // FOR LIVE STREAMS THROUGH PANDAFY
  playHls: async (request, h) => {
    const id = request.params.ID;
    return h.redirect(`https://cart.beastdevs.biz/hls/${id}`).temporary();
  },

  //Handles the rest of the channel play requests
  playChannel: async (request, h) => {

    const channelID = request.params.channelID;
    const username = request.params.username;
    const password = request.params.password;
    const type = request.params.TYPE;


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

    function processm3u8(tempFileName) {
      return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(path.join(__dirname, `../Temp/${tempFileName}`));
        const original = https.get(channels.url, async function(response) {
        const streamData = https.get(response.headers.location, function(response) {
            response.pipe(file);
            file.on("finish", async () => {
                file.close();
                resolve();
            });
          }).on("error", reject);
        }).on("error", reject);
      });
    }

    // We will want to stop there streams if they arent active
    // TODO: add a stop if account has expired
    if (!client.active) {
      return h.redirect('https://drive.google.com/uc?export=download&id=15INXyplB6vc7Mu00jtZvbJpr7pxyMOJH').temporary();
    }

    // If its a movie or tvshow we will just redirect to the url provided since we manage this ourselves
    if (type === 'movie' || type === 'tv') {
      return h.redirect(channels.url).temporary();
    }

    // For Live TV we will return the m3u8 stream output and create a buffer to allow constan streaming from
    // multiple devices
    tempFileName = `${username}${Date.now()}.m3u8`
    await processm3u8(tempFileName);
    let streamT = await fs.createReadStream(path.join(__dirname, `../Temp/${tempFileName}`));
    let streamDataT = await new Readable().wrap(streamT);
    return h.response(streamDataT)
      .header('Content-Type', 'application/x-mpegurl')
      .header('Connection', `keep-alive`)
      .header('Cache-Control', `no-store, no-cache, must-revalidate`)
  },

  // TODO: Improve this or remove
  apk: async (request, h) => {
    let stream = fs.createReadStream(path.join(__dirname, `../Storage/app.apk`));
    let streamData = new Readable().wrap(stream);
    return h.response(streamData)
      .header('Content-Type', 'application/apk')
      .header('Content-Disposition', 'attachment; filename=app.apk');
  },

  // TODO: xmltv guide needs updating and more tests
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

  // TODO: Might not be required we can just redirect since this is only for the live tv
  syncxmltv: async (request, h) => {
    const file = fs.createWriteStream(path.join(__dirname, `../Storage/epg.xml`));
    const epg = http.get("http://tanmedia.watch:8880/xmltv.php?username=mrcameronsim@gmail.com&password=lhE787Y5hu", function(response) {
       response.pipe(file);

       // after download completed close filestream
       file.on("finish", () => {
           file.close();
       });
    }).on('error', function(err) { // Handle errors
      if (cb) cb(err.message);
    });
  },

  // xtream api here. all requests are being hadnled.
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

        clientGroups = await ClientGroups.findAll({ where: { ClientId: client.id }, attributes: ["GroupId"], raw: true, nest: true })
            .then(function(clientGroups) {
                return clientGroups.map(function(clientGroups) { return clientGroups.GroupId; })
            });

        let channels = await Channels.findAll(
          {
              where: {
                  tvgtype: 'live',
                  GroupId: {
                    [Op.or]: clientGroups
                  }
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

        clientGroups = await ClientGroups.findAll({ where: { ClientId: client.id }, attributes: ["GroupId"], raw: true, nest: true })
            .then(function(clientGroups) {
                return clientGroups.map(function(clientGroups) { return clientGroups.GroupId; })
            });

          let channels = await Channels.findAll(
            {
                where: {
                    tvgtype: 'movie',
                    GroupId: {
                      [Op.or]: clientGroups
                    }
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
                    "added": Math.round(new Date(channel.createdAt).getTime()/1000),
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
        const vodID = request.query.vod_id
        let channel = await Channels.findOne(
          {
              where: {
                  id: vodID,
              },
          }
        );

        const imbd = await getJSON(`https://api.themoviedb.org/3/movie/${channel.imbdid}?api_key=16c1dc83a80675faa65ac467f40d4868`, function(error, response){
            return response;
        });

        let vodInfo = { "info":
         {
           "kinopoisk_url":`https://www.themoviedb.org/movie/${imbd.id}`,
           "tmdb_id":imbd.id,
           "name":imbd.original_title,
           "o_name":imbd.original_title,
           "cover_big":`https://image.tmdb.org/t/p/w600_and_h900_bestv2${imbd.backdrop_path}`,
           "movie_image":`https://image.tmdb.org/t/p/w600_and_h900_bestv2${imbd.poster_path}`,
           "release_date":imbd.release_date,
           "episode_run_time":imbd.runtime,
           "youtube_trailer":"",
           "director":"",
           "actors":"",
           "cast":"",
           "description":imbd.overview,
           "plot":imbd.overview,
           "age":"",
           "mpaa_rating":"",
           "rating_count_kinopoisk":0,
           "country":imbd.original_language,
           "genre":"",
           "backdrop_path":[`https://image.tmdb.org/t/p/w1280/${imbd.backdrop_path}`],
           "duration_secs":imbd.runtime * 60,
           "duration":"",
           "bitrate":7115,
           "rating":imbd.vote_average,
           "releasedate":imbd.release_date,
           "subtitles":[]
         },
         "movie_data":
           {
             "stream_id":channel.id,
             "name":channel.name,
             "title":channel.name,
             "year":"2022",
             "added":Math.round(new Date(channel.createdAt).getTime()/1000),
             "category_id":channel.GroupId,
             "category_ids":[channel.GroupId],
             "container_extension":"mp4",
             "custom_sid":"",
             "direct_source":""
           }
         }

        return h.response(vodInfo).code(200);
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
