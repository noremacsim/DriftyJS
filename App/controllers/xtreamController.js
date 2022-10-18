const http = require('http');
const https = require('https');
const { exec } = require("child_process");
const xml2js = require('xml2js');
const xmlParser = new xml2js.Parser({ attrkey: "ATTR" });
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
const {ChannelGroups} = require(path.join(__dirname, '../../Core/models/'));
const {Series} = require(path.join(__dirname, '../../Core/models/'));
const {Sessons} = require(path.join(__dirname, '../../Core/models/'));
const {RecentlyPlayed} = require(path.join(__dirname, '../../Core/models/'));
const {SeriesGroups} = require(path.join(__dirname, '../../Core/models/'));
const Plex = require(path.join(__dirname, '../controllers/plexController'));
const groupsControler = require(path.join(__dirname, '../controllers/groupsController'));



module.exports = {

  importMovies: async (request, h) => {
    const type = request.params.type;
    async function addMovies(type) {
      return new Promise(async (resolve, reject) => {
        const plex = new Plex(type);
        const genres = await plex.getGenres('movies');

        // Create the Genre if not exists
        for (const genre of genres) {
          let category = await groupsControler.findOrCreate(genre.ATTR.title, 'movies');
          let offset = 0;
          let movieImportCount = 0;
          plex.offsetExhausted = false;
          do {
            plex.offset = offset;
            let movies = await plex.getMoviesFromGenre(genre.ATTR.key);
            for (let movie of movies) {
              movieImportCount++;
              //console.log('Trying Import : ' + movieImportCount);
              movieJson = await plex.formatMovieForImport(movie);

              // Create the Movie into db
              let channel = await Channels.findOne(
                { where: {
                  name: movieJson.title,
                  tvgtype: 'movies',
                  UserId: 1
                }
              });
              if (channel) {
                continue;
              }
              channel = await Channels.create(
                  {
                      name: movieJson.title,
                      logo: movieJson.logo,
                      url: movieJson.url,
                      tvgtype: 'movies',
                      imbdid: movieJson.imbdid,
                      UserId: 1,
                      releaseDate: movieJson.releaseDate,
                      createdAt: movieJson.created,
                      plot: movieJson.summary,
                  }
              );
              await ChannelGroups.destroy({ where: { ChannelId: parseInt(channel.id) } });
              await ChannelGroups.create({
                  ChannelId: parseInt(channel.id),
                  GroupId: parseInt(category.id),
              });
              //console.log('Creating Group: Channel: ' + channel.id + ' Group: ' + category.id)
              //console.log('Imported: ' + movieImportCount);
            }
            offset = offset + 200;
            //console.log(offset);
          }
          while (!plex.offsetExhausted);
        }
        resolve();
      });
    }
    await addMovies(type);
    return 'done';
  },

  importTvShows: async (request, h) => {

    function timeConverter(UNIX_timestamp){
      var a = new Date(UNIX_timestamp * 1000);
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var year = a.getFullYear();
      var month = ("00" + (parseInt(a.getMonth()) + 1)).slice(-2);
      var date = ("00" + a.getDate()).slice(-2);
      var hour = ("00" + a.getHours()).slice(-2);
      var min = ("00" + a.getMinutes()).slice(-2);
      var sec = ("00" + a.getSeconds()).slice(-2);
      var time = year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec ;
      return time;
    }

    async function downloadTVShowList() {
      return new Promise((resolve, reject) => {
        const movieListUrl = `https://81-187-8-160.7e1f3569bd19422b9fb3b17d82ab1f8e.plex.direct:32400/library/sections/2/all?type=2&includeCollections=1&includeExternalMedia=1&includeAdvanced=1&includeMeta=1&X-Plex-Product=Plex%20Web&X-Plex-Version=4.92.0&X-Plex-Client-Identifier=e5uugpktpy8iardwmdspmbyq&X-Plex-Platform=Chrome&X-Plex-Platform-Version=106.0&X-Plex-Features=external-media%2Cindirect-media%2Chub-style-list&X-Plex-Model=hosted&X-Plex-Device=Windows&X-Plex-Device-Name=Chrome&X-Plex-Device-Screen-Resolution=1920x929%2C1920x1080&X-Plex-Container-Start=0&X-Plex-Container-Size=3000&X-Plex-Token=mAXoi8LLE3-bBzv_EehL&X-Plex-Provider-Version=5.1&X-Plex-Text-Format=plain&X-Plex-Drm=widevine&X-Plex-Language=en-GB`;

        let req = https.get(movieListUrl, function(res) {
          let data = '';
          res.on('data', function(stream) {
              data += stream;
          });
          res.on('end', function(){
              xmlParser.parseString(data, function(error, result) {
                  if(error === null) {
                      return resolve(result);
                  }
                  else {
                      return reject;
                  }
              });
          });
        });
      });
    }

    async function downloadTvSeasons(key) {
      return new Promise((resolve, reject) => {
        const movieListUrl = `https://81-187-8-160.7e1f3569bd19422b9fb3b17d82ab1f8e.plex.direct:32400${key}?excludeAllLeaves=1&includeUserState=1&X-Plex-Product=Plex%20Web&X-Plex-Version=4.92.0&X-Plex-Client-Identifier=e5uugpktpy8iardwmdspmbyq&X-Plex-Platform=Chrome&X-Plex-Platform-Version=106.0&X-Plex-Features=external-media%2Cindirect-media%2Chub-style-list&X-Plex-Model=hosted&X-Plex-Device=Windows&X-Plex-Device-Name=Chrome&X-Plex-Device-Screen-Resolution=1920x929%2C1920x1080&X-Plex-Container-Start=0&X-Plex-Container-Size=20&X-Plex-Token=mAXoi8LLE3-bBzv_EehL&X-Plex-Provider-Version=5.1&X-Plex-Text-Format=plain&X-Plex-Drm=widevine&X-Plex-Language=en-GB`;

        let req = https.get(movieListUrl, function(res) {
          let data = '';
          res.on('data', function(stream) {
              data += stream;
          });
          res.on('end', function(){
              xmlParser.parseString(data, function(error, result) {
                  if(error === null) {
                      return resolve(result);
                  }
                  else {
                      return reject;
                  }
              });
          });
        });
      });
    }

    async function downloadTvEpsiode(key) {
      return new Promise((resolve, reject) => {
        const movieListUrl = `https://81-187-8-160.7e1f3569bd19422b9fb3b17d82ab1f8e.plex.direct:32400${key}?excludeAllLeaves=1&includeUserState=1&X-Plex-Product=Plex%20Web&X-Plex-Version=4.92.0&X-Plex-Client-Identifier=e5uugpktpy8iardwmdspmbyq&X-Plex-Platform=Chrome&X-Plex-Platform-Version=106.0&X-Plex-Features=external-media%2Cindirect-media%2Chub-style-list&X-Plex-Model=hosted&X-Plex-Device=Windows&X-Plex-Device-Name=Chrome&X-Plex-Device-Screen-Resolution=1920x929%2C1920x1080&X-Plex-Container-Start=0&X-Plex-Container-Size=20&X-Plex-Token=mAXoi8LLE3-bBzv_EehL&X-Plex-Provider-Version=5.1&X-Plex-Text-Format=plain&X-Plex-Drm=widevine&X-Plex-Language=en-GB`;

        let req = https.get(movieListUrl, function(res) {
          let data = '';
          res.on('data', function(stream) {
              data += stream;
          });
          res.on('end', function(){
              xmlParser.parseString(data, function(error, result) {
                  if(error === null) {
                      return resolve(result);
                  }
                  else {
                      return reject;
                  }
              });
          });
        });
      });
    }

    async function addSeries(tvShowsJson) {
      return new Promise(async (resolve, reject) => {

        for (const seriesItem of tvShowsJson.MediaContainer.Directory) {

          let seriesKey = seriesItem.ATTR.key;
          let seriesName = seriesItem.ATTR.title;
          let seriesLogo = seriesItem.ATTR.thumb;
          let seriesGroupId = null;
          let seriesimbdid = null;
          let seriesUserId = 1;
          let seriesReleaseDate = seriesItem.ATTR.originallyAvailableAt;
          let seriesCoverImg = seriesItem.ATTR.thumb;
          let seriesBackdropimg = seriesItem.ATTR.thumb;
          let seriesPlot = seriesItem.ATTR.summary;
          let seriesRuntime = seriesItem.ATTR.duration;

          let series = await Series.findOne({ where: { name: seriesName, UserId: 1 } });

          // Add Series
          if (!series) {
            series = await Series.create(
              {
                name: seriesName,
                logo: `https://81-187-8-160.7e1f3569bd19422b9fb3b17d82ab1f8e.plex.direct:32400${seriesLogo}?X-Plex-Token=mAXoi8LLE3-bBzv_EehL`,
                GroupId: seriesGroupId,
                imbdid: seriesimbdid,
                UserId: seriesUserId,
                releaseDate: seriesReleaseDate,
                coverImg: `https://81-187-8-160.7e1f3569bd19422b9fb3b17d82ab1f8e.plex.direct:32400${seriesCoverImg}?X-Plex-Token=mAXoi8LLE3-bBzv_EehL`,
                backdropImg: `https://81-187-8-160.7e1f3569bd19422b9fb3b17d82ab1f8e.plex.direct:32400${seriesBackdropimg}?X-Plex-Token=mAXoi8LLE3-bBzv_EehL`,
                plot: seriesPlot,
                runtime: ((seriesRuntime % 60000) / 1000).toFixed(0),
              }
            );

            await SeriesGroups.destroy({ where: { SeriesId: parseInt(series.id) } });
            if (seriesItem.Genre) {
              for (const seriesCategorie of seriesItem.Genre) {
                let group = await groupsControler.findOrCreate(genre.ATTR.title, 'movies');
                await SeriesGroups.create({
                    SeriesId: parseInt(series.id),
                    GroupId: parseInt(group.id),
                });
              }
            } else {
              await SeriesGroups.create({
                  SeriesId: parseInt(series.id),
                  GroupId: 547,
              });
            }
          }

          // Add Seasons
          let seasons = await downloadTvSeasons(seriesKey);
          for (let seasonItem of seasons.MediaContainer.Directory) {
            let seasonKey = seasonItem.ATTR.key;
            let seasonName = seasonItem.ATTR.title;
            let seasonLogo = seasonItem.ATTR.thumb;
            let seasonSeriesID = series.id;
            let seasonImbdid = null;
            let seasonNumber = seasonItem.ATTR.index;
            let seasonEpisodes = seasonItem.ATTR.leafCount;
            let seasonOverview = seriesPlot;
            let seasonCoverimg = seasonItem.ATTR.art;
            let seasonUserid = 1;

            let season = await Sessons.findOne({ where: {
              name: seasonName,
              SeriesId: seasonSeriesID,
              season: seasonNumber,
              UserId: 1
            }});

            // Create the new season
            if (!season) {
              season = await Sessons.create(
                  {
                    name: seasonName,
                    logo: `https://81-187-8-160.7e1f3569bd19422b9fb3b17d82ab1f8e.plex.direct:32400${seasonLogo}?X-Plex-Token=mAXoi8LLE3-bBzv_EehL`,
                    SeriesId: seasonSeriesID,
                    imbdid: seasonImbdid,
                    season: seasonNumber,
                    episodes: seasonEpisodes,
                    overview: seasonOverview,
                    coverImg: `https://81-187-8-160.7e1f3569bd19422b9fb3b17d82ab1f8e.plex.direct:32400${seasonCoverimg}?X-Plex-Token=mAXoi8LLE3-bBzv_EehL`,
                    UserId: seasonUserid
                  }
              );
            }

            //Add Episodes
            let episodes = await downloadTvEpsiode(seasonKey);
            for (let episodeItem of episodes.MediaContainer.Video) {
              let channelEpisode = await Channels.findOne({ where: {
                name: episodeItem.ATTR.title,
                SeriesId: series.id,
                SessonId: season.id,
                UserId: 1
              }});

              if (!channelEpisode) {
                channelEpisode = await Channels.create(
                    {
                        name: episodeItem.ATTR.title,
                        logo: `https://81-187-8-160.7e1f3569bd19422b9fb3b17d82ab1f8e.plex.direct:32400${episodeItem.ATTR.thumb}?X-Plex-Token=mAXoi8LLE3-bBzv_EehL`,
                        GroupId: null,
                        url: `https://81-187-8-160.7e1f3569bd19422b9fb3b17d82ab1f8e.plex.direct:32400/video/:/transcode/universal/start.mpd?hasMDE=1&path=${episodeItem.ATTR.key}&mediaIndex=0&partIndex=0&protocol=dash&fastSeek=1&directPlay=0&directStream=1&subtitleSize=100&audioBoost=100&location=wan&addDebugOverlay=0&autoAdjustQuality=0&directStreamAudio=1&mediaBufferSize=102400&session=pdno4gtixhue98yjmt35jwwa&subtitles=burn&Accept-Language=en-GB&X-Plex-Session-Identifier=lhzj8ii7rhoy2gpok36yp5oh&X-Plex-Client-Profile-Extra=append-transcode-target-codec%28type%3DvideoProfile%26context%3Dstreaming%26audioCodec%3Daac%26protocol%3Ddash%29&X-Plex-Incomplete-Segments=1&X-Plex-Product=Plex%20Web&X-Plex-Version=4.92.0&X-Plex-Client-Identifier=e5uugpktpy8iardwmdspmbyq&X-Plex-Platform=Chrome&X-Plex-Platform-Version=106.0&X-Plex-Features=external-media%2Cindirect-media%2Chub-style-list&X-Plex-Model=hosted&X-Plex-Device=Windows&X-Plex-Device-Name=Chrome&X-Plex-Device-Screen-Resolution=1920x929%2C1920x1080&X-Plex-Token=mAXoi8LLE3-bBzv_EehL&X-Plex-Language=en-GB`,
                        tvgtype: 'series',
                        imbdid: null,
                        episode: episodeItem.ATTR.index,
                        releaseDate: episodeItem.ATTR.originallyAvailableAt,
                        plot: episodeItem.ATTR.summary,
                        runtime: ((episodeItem.ATTR.duration % 60000) / 1000).toFixed(0),
                        coverImg: `https://81-187-8-160.7e1f3569bd19422b9fb3b17d82ab1f8e.plex.direct:32400${episodeItem.ATTR.thumb}?X-Plex-Token=mAXoi8LLE3-bBzv_EehL`,
                        SeriesId: series.id,
                        SessonId: season.id,
                        UserId: 1,
                        createdAt: timeConverter(episodeItem.ATTR.addedAt),
                        updatedAt: timeConverter(episodeItem.ATTR.updatedAt)
                    }
                );
              }
            }
          }

        }
        return resolve();
      });
    }

    let tvShowsJson = await downloadTVShowList();
    await addSeries(tvShowsJson);
    return tvShowsJson;

  },

  importMoviesOld: async (request, h) => {

    function timeConverter(UNIX_timestamp){
      var a = new Date(UNIX_timestamp * 1000);
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var year = a.getFullYear();
      var month = ("00" + (parseInt(a.getMonth()) + 1)).slice(-2);
      var date = ("00" + a.getDate()).slice(-2);
      var hour = ("00" + a.getHours()).slice(-2);
      var min = ("00" + a.getMinutes()).slice(-2);
      var sec = ("00" + a.getSeconds()).slice(-2);
      var time = year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec ;
      return time;
    }

    async function downloadMovieList() {
      return new Promise((resolve, reject) => {
        const movieListUrl = `https://81-187-8-160.7e1f3569bd19422b9fb3b17d82ab1f8e.plex.direct:32400/library/sections/1/all?type=1&includeCollections=1&includeExternalMedia=1&includeAdvanced=1&includeMeta=1&X-Plex-Product=Plex%20Web&X-Plex-Version=4.92.0&X-Plex-Client-Identifier=e5uugpktpy8iardwmdspmbyq&X-Plex-Platform=Chrome&X-Plex-Platform-Version=106.0&X-Plex-Features=external-media%2Cindirect-media%2Chub-style-list&X-Plex-Model=hosted&X-Plex-Device=Windows&X-Plex-Device-Name=Chrome&X-Plex-Device-Screen-Resolution=1530x929%2C1920x1080&X-Plex-Container-Start=0&X-Plex-Container-Size=3000&X-Plex-Token=mAXoi8LLE3-bBzv_EehL&X-Plex-Provider-Version=5.1&X-Plex-Text-Format=plain&X-Plex-Drm=widevine&X-Plex-Language=en-GB`;


        let req = https.get(movieListUrl, function(res) {
          let data = '';
          res.on('data', function(stream) {
              data += stream;
          });
          res.on('end', function(){
              xmlParser.parseString(data, function(error, result) {
                  if(error === null) {
                      return resolve(result);
                  }
                  else {
                      return reject;
                  }
              });
          });
        });
      });
    }

    async function getFinalImbdID(key) {
      return new Promise((resolve, reject) => {
        const movieDetails = `https://81-187-8-160.7e1f3569bd19422b9fb3b17d82ab1f8e.plex.direct:32400${key}?includeConcerts=1&includeExtras=1&includeOnDeck=1&includePopularLeaves=1&includePreferences=1&includeReviews=1&includeChapters=1&includeStations=1&includeExternalMedia=1&asyncAugmentMetadata=1&asyncCheckFiles=1&asyncRefreshAnalysis=1&asyncRefreshLocalMediaAgent=1&X-Plex-Product=Plex%20Web&X-Plex-Version=4.92.0&X-Plex-Client-Identifier=e5uugpktpy8iardwmdspmbyq&X-Plex-Platform=Chrome&X-Plex-Platform-Version=106.0&X-Plex-Features=external-media%2Cindirect-media%2Chub-style-list&X-Plex-Model=hosted&X-Plex-Device=Windows&X-Plex-Device-Name=Chrome&X-Plex-Device-Screen-Resolution=1530x929%2C1920x1080&X-Plex-Token=mAXoi8LLE3-bBzv_EehL&X-Plex-Provider-Version=5.1&X-Plex-Text-Format=plain&X-Plex-Drm=widevine&X-Plex-Language=en-GB`;


        let req = https.get(movieDetails, function(res) {
          let data = '';
          res.on('data', function(stream) {
              data += stream;
          });
          res.on('end', function(){
              xmlParser.parseString(data, function(error, result) {
                  if(error === null) {
                      return resolve(result);
                  }
                  else {
                      return reject;
                  }
              });
          });
        });
      });
    }

    async function addGroup(group) {
        let groups = await Groups.findOne({
            where: {
              type: 'movies',
              [Op.or]: [
                  { name: group },
                  { mapped: group },
                ]
            }
        });

        if (groups) {
          return groups;
        }

        groups = await Groups.create(
            {
                name: group,
                mapped: null,
                VOD: 1,
                UserId: 1,
                type: 'movies',
            }
        );

        return groups;
    }

    async function addMovies(moviesJson) {
      return new Promise(async (resolve, reject) => {
        for (const movieItem of moviesJson.MediaContainer.Video) {

          let title = movieItem.ATTR.title;
          let url = `https://81-187-8-160.7e1f3569bd19422b9fb3b17d82ab1f8e.plex.direct:32400/video/:/transcode/universal/start.mpd?hasMDE=1&path=${movieItem.ATTR.key}&mediaIndex=0&partIndex=0&protocol=dash&fastSeek=1&directPlay=0&directStream=1&subtitleSize=100&audioBoost=100&location=wan&addDebugOverlay=0&autoAdjustQuality=0&directStreamAudio=1&mediaBufferSize=102400&session=pdno4gtixhue98yjmt35jwwa&subtitles=burn&Accept-Language=en-GB&X-Plex-Session-Identifier=lhzj8ii7rhoy2gpok36yp5oh&X-Plex-Client-Profile-Extra=append-transcode-target-codec%28type%3DvideoProfile%26context%3Dstreaming%26audioCodec%3Daac%26protocol%3Ddash%29&X-Plex-Incomplete-Segments=1&X-Plex-Product=Plex%20Web&X-Plex-Version=4.92.0&X-Plex-Client-Identifier=e5uugpktpy8iardwmdspmbyq&X-Plex-Platform=Chrome&X-Plex-Platform-Version=106.0&X-Plex-Features=external-media%2Cindirect-media%2Chub-style-list&X-Plex-Model=hosted&X-Plex-Device=Windows&X-Plex-Device-Name=Chrome&X-Plex-Device-Screen-Resolution=1920x929%2C1920x1080&X-Plex-Token=mAXoi8LLE3-bBzv_EehL&X-Plex-Language=en-GB`
          let logo = `https://81-187-8-160.7e1f3569bd19422b9fb3b17d82ab1f8e.plex.direct:32400${movieItem.ATTR.thumb}?X-Plex-Token=mAXoi8LLE3-bBzv_EehL`;
          let releaseDate = movieItem.ATTR.originallyAvailableAt;
          let created = timeConverter(movieItem.ATTR.addedAt);
          let updated = timeConverter(movieItem.ATTR.updatedAt);
          let imbdid = null;
          let summary = movieItem.ATTR.summary

          let channel = await Channels.findOne({ where: { name: title, UserId: 1 } });
          if (channel) {
            continue;
          }

          if(movieItem.ATTR.guid) {
            if (movieItem.ATTR.guid.toLowerCase().includes('imdb')) {
              let firstSplit = movieItem.ATTR.guid.split("imdb://");
              let final = firstSplit[1].split('?lang');
              imbdid = final[0];
            }
          }

          if (!imbdid) {
            let movieDetails = await getFinalImbdID(movieItem.ATTR.key)
            if (movieDetails.MediaContainer.Video[0].Guid) {
              for (let guidlist of movieDetails.MediaContainer.Video[0].Guid) {
                let guidname = guidlist.ATTR.id;
                if (guidname.toLowerCase().includes('imdb')) {
                  let firstSplit = guidname.split("://");
                  imbdid = firstSplit[1];
                  break;
                }
              }
            }
          }

          channel = await Channels.create(
              {
                  name: title,
                  logo: logo,
                  url: url,
                  GroupId: null,
                  tvgid: null,
                  tvgtype: 'movies',
                  imbdid: imbdid,
                  UserId: 1,
                  releaseDate: releaseDate,
                  createdAt: created,
                  updatedAt: updated,
                  plot: summary,
              }
          );

          await ChannelGroups.destroy({ where: { ChannelId: parseInt(channel.id) } });
          if (movieItem.Genre) {
            for (const movieCategorie of movieItem.Genre) {
              let group = await addGroup(movieCategorie.ATTR.tag);
              await ChannelGroups.create({
                  ChannelId: parseInt(channel.id),
                  GroupId: parseInt(group.id),
              });
            }
          } else {
            await ChannelGroups.create({
                ChannelId: parseInt(channel.id),
                GroupId: 520,
            });
          }
        }
        return resolve();
      });
    }

    let moviesJson = await downloadMovieList();
    await addMovies(moviesJson);
    return moviesJson;

  },

  updateRecentMovies: async (request, h) => {

    let category = await groupsControler.findOrCreate('Recently Released', 'movies');

    let movies = await Channels.findAll(
      {
          attributes: ['id'],
          limit: 50,
          where: {
              tvgtype: 'movies',
          },
          order: [
              ['releaseDate', 'DESC'],
          ],
      }
    );

    await ChannelGroups.destroy({ where: { GroupId: parseInt(category.id) } });
    for (const movie of movies) {
      await ChannelGroups.create({
          ChannelId: parseInt(movie.id),
          GroupId: parseInt(category.id),
      });
    }

    return movies;

  },

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

    let recentlyBeenPlayed = await RecentlyPlayed.findOne({
        where: {
            ChannelId: parseInt(channelID),
            ClientId: parseInt(client.id),
        },
    });

    if (recentlyBeenPlayed) {
      await RecentlyPlayed.update(
          {
            Channel: channels.name ?? null,
          },
          {
            where: {
                ChannelId: parseInt(channelID),
                ClientId: parseInt(client.id),
            },
          }
      );
    } else {
      await RecentlyPlayed.create({
          ChannelId: parseInt(channelID),
          ClientId: parseInt(client.id),
          Channel: channels.name ?? null,
      });
    }

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
          updatedFile.write('#EXT-X-TARGETDURATION:8 \n');
          updatedFile.write('#EXTINF:10.000000, \n');
          updatedFile.write(result.items[0].url);
          updatedFile.write('#EXTINF:8.000000, \n');
          updatedFile.write(result.items[1].url);
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
    await getUpdated(tempFileName);

    let streamT = await fs.createReadStream(path.join(__dirname, `../Temp/1${tempFileName}`));
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

      return h.redirect('http://tanmedia.watch:8880/xmltv.php?username=mrcameronsim@gmail.com&password=lhE787Y5hu').temporary();
    } else {
      return Boom.unauthorized('invalid login');
    }
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

        let channels = [];
        let channelGroups = [];


        if (request.query.category_id) {
          clientGroups = await ClientGroups.findAll({ where: { ClientId: client.id, GroupId: request.query.category_id}, attributes: ["GroupId"], raw: true, nest: true })
              .then(function(clientGroups) {
                  return clientGroups.map(function(clientGroups) { return clientGroups.GroupId; })
              });
        } else {
          clientGroups = await ClientGroups.findAll({ where: { ClientId: client.id }, attributes: ["GroupId"], raw: true, nest: true })
              .then(function(clientGroups) {
                  return clientGroups.map(function(clientGroups) { return clientGroups.GroupId; })
              });
        }

        if (clientGroups.length < 1) {
          return h.response([]).code(200);
        }

        channelGroups = await ChannelGroups.findAll({ where: { GroupId: {[Op.or]: clientGroups}}, attributes: ["ChannelId"], raw: true, nest: true })
            .then(function(channelGroups) {
                return channelGroups.map(function(channelGroups) { return channelGroups.ChannelId; })
            });

        if (channelGroups.length < 1) {
          return h.response([]).code(200);
        }

        channels = await Channels.findAll(
          {
              where: {
                  tvgtype: 'movies',
                  id: {
                    [Op.or]: channelGroups
                  }
              },
          }
        );


        for (const channel of channels) {

          channelGroups = await ChannelGroups.findAll({ where: { ChannelId: channel.id }, attributes: ["GroupId"], raw: true, nest: true })
              .then(function(channelGroups) {
                  return channelGroups.map(function(channelGroups) { return channelGroups.GroupId; })
              });

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
                  "added": Math.round(new Date(channel.releaseDate).getTime()/1000),
                  "custom_sid":"",
                  "direct_source":"",
                  "category_id":channelGroups[0] ?? channelGroups,
                  "category_ids":channelGroups,
                }
              );
            }

        // Lets Add Recently Released Movies
        let recentCategory = await groupsControler.findOrCreate('Recently Released', 'movies');
        let recentMovies = await Channels.findAll(
          {
              attributes: ['id'],
              limit: 50,
              where: {
                  tvgtype: 'movies',
              },
              order: [
                  ['releaseDate', 'DESC'],
              ],
          }
        );

        for (recent of recentMovies) {
          vodChannels.push(
                {
                  "num":recent.id,
                  "name":recent.name,
                  "stream_type":'movie',
                  "stream_id":recent.id,
                  "stream_icon":recent.logo,
                  "rating":"",
                  "rating_5based":0,
                  "container_extension":"mp4",
                  "added": Math.round(new Date(recent.releaseDate).getTime()/1000),
                  "custom_sid":"",
                  "direct_source":"",
                  "category_id":recentCategory.id,
                  "category_ids":[recentCategory.id],
                }
              );
        }

        return h.response(vodChannels).code(200);
      }

      if (request.query.action === 'get_series') {
        let clientGroups = [];
        let seriesGroups = [];
        let series = [];

        if (request.query.category_id) {
          clientGroups = await ClientGroups.findAll({ where: { ClientId: client.id, GroupId: request.query.category_id}, attributes: ["GroupId"], raw: true, nest: true })
              .then(function(clientGroups) {
                  return clientGroups.map(function(clientGroups) { return clientGroups.GroupId; })
              });
        } else {
          clientGroups = await ClientGroups.findAll({ where: { ClientId: client.id }, attributes: ["GroupId"], raw: true, nest: true })
              .then(function(clientGroups) {
                  return clientGroups.map(function(clientGroups) { return clientGroups.GroupId; })
              });
        }

        if (clientGroups.length < 1) {
          return h.response([]).code(200);
        }

        seriesGroups = await SeriesGroups.findAll({ where: { GroupId: {[Op.or]: clientGroups}}, attributes: ["SeriesId"], raw: true, nest: true })
            .then(function(seriesGroups) {
                return seriesGroups.map(function(seriesGroups) { return seriesGroups.SeriesId; })
            });

        if (seriesGroups.length < 1) {
          return h.response([]).code(200);
        }

        series = await Series.findAll(
          {
              where: {
                id: {
                  [Op.or]: seriesGroups
                }
              },
          }
        );

        // TODO: Pull IMBD Data

        for (const serie of series) {
          serieGroups = await SeriesGroups.findAll({ where: { SeriesId: serie.id }, attributes: ["GroupId"], raw: true, nest: true })
              .then(function(serieGroups) {
                  return serieGroups.map(function(serieGroups) { return serieGroups.GroupId; })
              });
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
              "category_id":serieGroups[0] ?? serieGroups,
              "category_ids":serieGroups
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
        let seasonsCount = sessonsData.length + 1;
        let seasonsArrayEpisodes = {};
        for (let seasonCounter = 1; seasonCounter < seasonsCount; seasonCounter++) {
            seasonsArrayEpisodes[seasonCounter] = episodesData;
        }

        let all = {
          'seasons': sessonsData,
          'info': info,
          "episodes": seasonsArrayEpisodes
        }

        return h.response(all).code(200);
      }

      if (request.query.action === 'get_vod_info') {

        const vodID = request.query.vod_id
        let imbd = [];

        let channel = await Channels.findOne(
          {
              where: {
                  id: vodID,
              },
          }
        );

        if (channel.imbdid) {
          imbd = await getJSON(`https://api.themoviedb.org/3/movie/${channel.imbdid}?api_key=16c1dc83a80675faa65ac467f40d4868&`, function(error, response){
              return response;
          });
        }

        let vodInfo = { "info":
         {
           "kinopoisk_url":`https://www.themoviedb.org/movie/${imbd.id  ?? null}`,
           "tmdb_id":imbd.id ?? null,
           "name":imbd.original_title ?? null,
           "o_name":imbd.original_title ?? null,
           "cover_big":`https://image.tmdb.org/t/p/w600_and_h900_bestv2${imbd.backdrop_path ?? null}`,
           "movie_image":`https://image.tmdb.org/t/p/w600_and_h900_bestv2${imbd.poster_path ?? null}`,
           "release_date":imbd.release_date ?? null,
           "episode_run_time":imbd.runtime ?? null,
           "youtube_trailer":"",
           "director":"",
           "actors":"",
           "cast":"",
           "description":imbd.overview ?? null,
           "plot":imbd.overview ?? null,
           "age":"",
           "mpaa_rating":"",
           "rating_count_kinopoisk":0,
           "country":imbd.original_language ?? null,
           "genre":"",
           "backdrop_path":[`https://image.tmdb.org/t/p/w1280/${imbd.backdrop_path ?? null}`],
           "duration_secs":imbd.runtime  ? imbd.runtime * 60 : null,
           "duration":imbd.runtime ?? null,
           "bitrate":7115,
           "rating":imbd.vote_average ?? null,
           "releasedate":imbd.release_date ?? null,
           "subtitles":[]
         },
         "movie_data":
           {
             "stream_id":channel.id,
             "name":channel.name,
             "title":channel.name,
             "year":"2022",
             "added":Math.round(new Date(imbd.release_date).getTime()/1000),
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
