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

let Plex = class {
    constructor(server) {
        this.identifier = 'e5uugpktpy8iardwmdspmbyq'
        this.offsetExhausted = false;
        this.offset = 0;
        this.setServer(server);
        this.setToken(server);
    }

    setServer(server) {
        const servers = {
          ross: 'https://81-187-8-160.7e1f3569bd19422b9fb3b17d82ab1f8e.plex.direct:32400',
          plex: 'https://vod.provider.plex.tv',
        }

        this.server = server;
        this.baseUrl = servers[server];
    }

    setToken(server) {
      const servers = {
        ross: 'mAXoi8LLE3-bBzv_EehL',
        plex: 'RtmLCwY2CH24xZo6X_VA',
      }
      this.token = servers[server]
    }

    getServerQeuryType(type) {
      const qeurys = {
        movies : {
          ross: '1',
          plex: 'categories'
        },
        genres : {
          ross: 'categories',
          plex: 'all',
        }
      }
      return qeurys[type][this.server];
    }

    convertTime(UNIX_timestamp) {
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

    // Types: movies, series
    async getGenres(type) {
      return new Promise(async (resolve, reject) => {
        const baseUrl = new URL(`${this.baseUrl}/library/sections/${this.getServerQeuryType(type)}/${this.getServerQeuryType('genres')}`);
        let json = await this.makePlexRequestToJson(baseUrl);
        return resolve(json.MediaContainer.Directory);
      });
    }

    async getMoviesFromGenre(key) {
      return new Promise(async (resolve, reject) => {
        const baseUrl = new URL(`${this.baseUrl}${key}`);
        baseUrl.searchParams.append("X-Plex-Container-Start", this.offset);
        let json = await this.makePlexRequestToJson(baseUrl);
        if (json.MediaContainer.ATTR.size == 0) {
          this.offsetExhausted = true;
          return resolve([]);
        }
        return resolve(json.MediaContainer.Video);
      });
    }

    async makePlexRequestToJson(url) {
      url.searchParams.append("includeCollections", "1");
      url.searchParams.append("includeExternalMedia", "1");
      url.searchParams.append("includeAdvanced", "1");
      url.searchParams.append("includeMeta", "1");
      url.searchParams.append("X-Plex-Product", "Plex Web");
      url.searchParams.append("X-Plex-Version", "4.92.0");
      url.searchParams.append("X-Plex-Client-Identifier", this.identifier);
      url.searchParams.append("X-Plex-Platform", "Chrome");
      url.searchParams.append("X-Plex-Platform-Version", "1");
      url.searchParams.append("X-Plex-Features", "external-media,indirect-media,hub-style-list");
      url.searchParams.append("X-Plex-Model", "hosted");
      url.searchParams.append("X-Plex-Device", "Windows");
      url.searchParams.append("X-Plex-Device-Screen-Resolution", "1920x1080");
      url.searchParams.append("X-Plex-Container-Size", "200");
      url.searchParams.append("X-Plex-Token", this.token);
      url.searchParams.append("X-Plex-Provider-Version", "5.1");
      url.searchParams.append("X-Plex-Text-Format", "plain");
      url.searchParams.append("X-Plex-Language", "en-GB");

      return new Promise((resolve, reject) => {
        let req = https.get(url, function(res) {
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

    async formatMovieForImport(movie) {
      return new Promise(async (resolve, reject) => {
        let url = await this.createPlayUrl(movie.ATTR.key);
        let logo = movie.ATTR.thumb;

        //https://81-187-8-160.7e1f3569bd19422b9fb3b17d82ab1f8e.plex.direct:32400/library/parts/201323/1664352635/file.mkv?X-Plex-Session-Identifier=xyduws1peumrye9agovz1e8c&X-Plex-Product=Plex%20Web&X-Plex-Version=4.92.0&X-Plex-Client-Identifier=e5uugpktpy8iardwmdspmbyq&X-Plex-Platform=Chrome&X-Plex-Platform-Version=106.0&X-Plex-Features=external-media%2Cindirect-media%2Chub-style-list&X-Plex-Model=hosted&X-Plex-Device=Windows&X-Plex-Device-Name=Chrome&X-Plex-Device-Screen-////Resolution=1920x929%2C1920x1080&X-Plex-Token=mAXoi8LLE3-bBzv_EehL&X-Plex-Language=en-GB&Accept-Language=en-GB

        if (this.server == 'ross') {
          logo = `https://81-187-8-160.7e1f3569bd19422b9fb3b17d82ab1f8e.plex.direct:32400${movie.ATTR.thumb}?X-Plex-Token=${this.token}`
        }

        if (!logo) {
          if (movie.ATTR.art) {
            logo = movie.ATTR.art;
          } else {
            logo = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1IHysND-KWERj9YAcEFu81BoUgjfBJw23TA&usqp=CAU';
          }
        }


        const json = {
          title: movie.ATTR.title,
          url: url,
          logo: logo,
          releaseDate: movie.ATTR.originallyAvailableAt,
          created: this.convertTime(movie.ATTR.addedAt),
          imbdid: null,
          summary: null,
        }
        return resolve(json)
      });
    }

    async createPlayUrl(path) {
      let url = null;

      // Stream URL For Plex Server
      if (this.server == 'plex') {
        let mediaUrl = new URL(`${this.baseUrl}${path}`);
        let json = await this.makePlexRequestToJson(mediaUrl);
        for (let movieMedia of json.MediaContainer.Video[0].Media) {
          if (movieMedia.ATTR.protocol == 'hls') {
            path = movieMedia.Part[0].ATTR.key
          }
        }
        url = new URL(`${this.baseUrl}${path}`);
        url.searchParams.append("X-Plex-Product", "Plex Web");
        url.searchParams.append("X-Plex-Version", "4.92.0");
        url.searchParams.append("X-Plex-Platform", "Chrome");
        url.searchParams.append("X-Plex-Platform-Version", "106.0");
        url.searchParams.append("X-Plex-Features", "external-media,indirect-media,hub-style-list");
        url.searchParams.append("X-Plex-Model", "hosted");
        url.searchParams.append("X-Plex-Device", "Windows");
        url.searchParams.append("X-Plex-Device-Screen-Resolution", "1920x1080");
        url.searchParams.append("X-Plex-Token", this.token);
        url.searchParams.append("X-Plex-Language", "en-GB");
      }

      // Stream URL For Ross Server
      if (this.server == 'ross') {
        url = new URL(`${this.baseUrl}/video/:/transcode/universal/start.m3u8`);
        url.searchParams.append("path", path);
        url.searchParams.append("X-Plex-Product", "Plex Web");
        url.searchParams.append("X-Plex-Version", "4.92.0");
        url.searchParams.append("X-Plex-Platform", "Chrome");
        url.searchParams.append("X-Plex-Platform-Version", "106.0");
        url.searchParams.append("X-Plex-Features", "external-media,indirect-media,hub-style-list");
        url.searchParams.append("X-Plex-Model", "hosted");
        url.searchParams.append("X-Plex-Device", "Windows");
        url.searchParams.append("X-Plex-Device-Screen-Resolution", "1920x1080");
        url.searchParams.append("X-Plex-Token", this.token);
        url.searchParams.append("X-Plex-Language", "en-GB");
      }

      return url.href;
    }
}

module.exports = Plex;
