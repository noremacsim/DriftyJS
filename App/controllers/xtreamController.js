const http = require('http');
const https = require('https');
const { exec } = require("child_process");
const path = require("path");
const fs = require('fs');
const Boom = require('boom');
const util = require('util');
const getJSON = require('get-json')
const parser = require('iptv-playlist-parser');
const { Readable } = require('stream');
const { Op } = require("sequelize");
const {Groups} = require(path.join(__dirname, '../../Core/models/'));
const {Channels} = require(path.join(__dirname, '../../Core/models/'));
const {Client} = require(path.join(__dirname, '../../Core/models/'));
const {ClientGroups} = require(path.join(__dirname, '../../Core/models/'));
const {Series} = require(path.join(__dirname, '../../Core/models/'));
const {Sessons} = require(path.join(__dirname, '../../Core/models/'));

module.exports = {

  // Play Movie Or TV SHOW.
  playm3u8: async (request, h) => {
    const file = request.params.file
    const type = request.params.type
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

    let streamT = await fs.createReadStream(path.join(__dirname, `../m3u/${type}/${file}`));
    //let streamDataT = await new Readable().wrap(streamT);
    return h.response(streamT)
      .header('Content-Type', 'application/x-mpegurl')
      .header('Content-Disposition', 'attachment; filename=index.m3u8');
  },

  // FOR LIVE STREAMS THROUGH PANDAFY
  playHls: async (request, h) => {
    const id = request.params.ID;

    const domains = [
      'https://cart.beastdevs.biz/hls/',
      'http://185.229.241.224/hls/'
    ]

    let useDomain = '';
    let requestType = http;

    for (const domain of domains) {
      let status = null;
      requestType = http;
      useDomain = domain;

      if (domain.includes('https://')) {
        requestType = https;
      }

      status = await requestType.get(`${domain}${id}`, function(res) {
        return res.statusCode
      })

      if (status === 200) {
        break;
      }
    }


    // TODO: add a check if the stream is up if not update the stream. Double check we will need it here though.
    return h.redirect(`${useDomain}${id}`).temporary();
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

    async function getUpdated(tempFileName) {
      return new Promise((resolve, reject) => {
        const m3uFile = fs.readFileSync(path.join(__dirname, `../Temp/${tempFileName}`), 'utf-8');
        const lines = m3uFile.split("\n");
        const result = parser.parse(m3uFile);
        updatedFile = fs.createWriteStream(path.join(__dirname, `../Temp/1${tempFileName}`));
        updatedFile.write('#EXTM3U \n');
        updatedFile.write('#EXT-X-VERSION:3 \n');
        updatedFile.write(`${lines[2]} \n`);
        updatedFile.write('#EXT-X-ALLOW-CACHE:NO \n');
        updatedFile.write('#EXT-X-TARGETDURATION:5 \n');
        updatedFile.write('#EXTINF:10.000000, \n');
        updatedFile.write(result.items[0].url);
        updatedFile.end();
        updatedFile.on('finish', function () {
          resolve();
        });
      });
    }

    function processm3u8(tempFileName) {
      return new Promise((resolve, reject) => {
        return exec(`wget -O ${path.join(__dirname, `../Temp/${tempFileName}`)} ${channels.url}`, (error, stdout, stderr) => {
          if (error) {
              return reject;
          }
          return resolve();
        });
        return resolve();
      });
    }

    const ToDate = new Date();
    const userExpDate = new Date(client.exp_date).getTime();
    if (new Date(client.exp_date).getTime() <= ToDate.getTime()) {
      return h.redirect('https://drive.google.com/uc?export=download&id=15INXyplB6vc7Mu00jtZvbJpr7pxyMOJH').temporary();
     }

    if (!client.active) {
      return h.redirect('https://drive.google.com/uc?export=download&id=15INXyplB6vc7Mu00jtZvbJpr7pxyMOJH').temporary();
    }

    // If its a movie or tvshow we will just redirect to the url provided since we manage this ourselves
    if (type === 'movie' || type === 'series') {

      //If no domain its a local file.
      if (!channels.url.includes('https://') && !channels.url.includes('https://')) {
        return h.redirect(`/${username}/${password}${channels.url}`).temporary();
      }
      return h.redirect(channels.url).temporary();
    }

    // For Live TV we will return the m3u8 stream output and create a buffer to allow constan streaming from
    // multiple devices
    tempFileName = `${username}${Date.now()}.m3u8`
    await processm3u8(tempFileName);
    //await getUpdated(tempFileName);

    let streamT = await fs.createReadStream(path.join(__dirname, `../Temp/${tempFileName}`));
    let streamDataT = await new Readable().wrap(streamT);
    return h.response(streamDataT)
      .header('Content-Type', 'application/x-mpegurl')
      .header('Connection', `keep-alive`)
      .header('Cache-Control', `no-store, no-cache, must-revalidate`)
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
    fs.unlinkSync(path.join(__dirname, `../Storage/epg.xml`));
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
    let tvCategories = [];
    let tvSeries = [];

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

        if (clientGroups.length < 1) {
          return h.response([]).code(200);
        }

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


        if (clientGroups.length < 1) {
          return h.response([]).code(200);
        }

        const vods = await Groups.findAll(
          {
            where: {
              type: 'movies',
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

        clientGroups = await ClientGroups.findAll({ where: { ClientId: client.id }, attributes: ["GroupId"], raw: true, nest: true })
            .then(function(clientGroups) {
                return clientGroups.map(function(clientGroups) { return clientGroups.GroupId; })
            });

        if (clientGroups.length < 1) {
          return h.response([]).code(200);
        }

        const tvcats = await Groups.findAll(
          {
            where: {
              type: 'series',
              id: {
                [Op.or]: clientGroups
              }
            }
          }
        );

        for (const tvcat of tvcats) {
          tvCategories.push(
                {
                  "category_id":tvcat.id,
                  "category_name":tvcat.name,
                  "parent_id":0
                }
              );
        }

        return h.response(tvCategories).code(200);
      }

      if (request.query.action === 'get_live_streams') {

        clientGroups = await ClientGroups.findAll({ where: { ClientId: client.id }, attributes: ["GroupId"], raw: true, nest: true })
            .then(function(clientGroups) {
                return clientGroups.map(function(clientGroups) { return clientGroups.GroupId; })
            });

        if (clientGroups.length < 1) {
          return h.response([]).code(200);
        }

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
                  "added":Math.round(new Date(channel.createdAt).getTime()/1000),
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

          if (clientGroups.length < 1) {
            return h.response([]).code(200);
          }

          let channels = await Channels.findAll(
            {
                where: {
                    tvgtype: 'movies',
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
                    tvgtype: 'movies',
                },
            });
          }

          for (const channel of channels) {
            vodChannels.push(
                  {
                    "num":channel.id,
                    "name":channel.name,
                    "stream_type":'movie',
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

        clientGroups = await ClientGroups.findAll({ where: { ClientId: client.id }, attributes: ["GroupId"], raw: true, nest: true })
            .then(function(clientGroups) {
                return clientGroups.map(function(clientGroups) { return clientGroups.GroupId; })
            });

        if (clientGroups.length < 1) {
          return h.response([]).code(200);
        }

        let series = await Series.findAll(
          {
              where: {
                  GroupId: {
                    [Op.or]: clientGroups
                  }
              },
          }
        );

        // TODO: Pull IMBD Data

        for (const serie of series) {
          tvSeries.push({
              "num":serie.id,
              "name":serie.name,
              "title":serie.name,
              "year": serie.releaseDate,
              "stream_type":"series",
              "series_id":serie.id,
              "cover": serie.coverImg,
              "plot": serie.plot,
              "cast":"",
              "director":"",
              "genre":"",
              "release_date": serie.releaseDate,
              "releaseDate": serie.releaseDate,
              "last_modified":"1664354413",
              "rating":"",
              "rating_5based":0,
              "backdrop_path":[serie.backdropImg],
              "youtube_trailer":"",
              "episode_run_time":serie.runtime,
              "category_id":serie.GroupId,
              "category_ids":[serie.GroupId]
          })
        }

        return h.response(tvSeries).code(200);
      }

      if (request.query.action === 'get_series_info') {

        const series_id = request.query.series_id;

        let series = await Series.findOne(
          {
              where: {
                  id: series_id
              },
          }
        );

        let sessons = await Sessons.findAll(
          {
              where: {
                  SeriesId: series_id
              },
          }
        );

        let episodes = await Channels.findAll(
          {
            where: {
              SeriesId: series_id
            }
          }
        )

        let sessonsData = [];
        for (const sesson of sessons) {
          sessonsData.push({
            "air_date":"",
            "episode_count":sesson.episodes,
            "id":sesson.id,
            "name":sesson.name,
            "overview":sesson.overview,
            "season_number":sesson.season,
            "cover":sesson.coverImg,
            "cover_big":sesson.coverImg
          })
        }

        let info =
        {
          "name":series.name,
          "title":series.name,
          "year":series.releaseDate,
          "cover":series.coverImg,
          "plot":series.plot,
          "cast":"",
          "director":"",
          "genre":"",
          "release_date":series.releaseDate,
          "releaseDate":series.releaseDate,
          "last_modified":"",
          "rating":"",
          "rating_5based":0,
          "backdrop_path":[series.backdropImg],
          "youtube_trailer":series.youtubeID,
          "episode_run_time":series.runtime,
          "category_id":series.GroupId,
          "category_ids":[series.GroupId]
        }

        // THIS WILL BE CHANNELS
        let episodesData = [];
        let seasoninfo = '';

        for (const episode of episodes) {

          seasoninfo = await Sessons.findOne(
            {
              where: {
                id: episode.SessonId
              }
            }
          )

          episodesData.push({
            "id":episode.id,
            "episode_num":episode.episode,
            "title":episode.name,
            "container_extension":"mp4",
            "info": {
              "tmdb_id":episode.imbdid,
              "release_date":episode.releaseDate,
              "plot":episode.plot,
              "duration_secs":episode.runtime,
              "duration":`${episode.runtime / 60} minutes`,
              "movie_image":episode.logo,
              "bitrate":0,
              "rating":0,
              "season":seasoninfo.season,
              "cover_big":episode.coverImg
            },
            "subtitles":[],
            "custom_sid":"",
            "added":Math.round(new Date(episode.createdAt).getTime()/1000),
            "season":seasoninfo.season,
            "direct_source":""
          })
        }


        let all = {
          'seasons': sessonsData,
          'info': info,
          "episodes": {"1" : episodesData}
        }

        return h.response(all).code(200);
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
           "duration":imbd.runtime,
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
            "max_connections":"20",
            "allowed_output_formats":["m3u8", "ts"]
          },
          "server_info":{
            "xui":true,
            "version":"1.5.12",
            "revision":2,
            "url":"192.168.1.191",
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
