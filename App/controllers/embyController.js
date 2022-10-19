const path = require("path");
const fs = require('fs');
const {Client} = require(path.join(__dirname, '../../Core/models/'));
const {ClientGroups} = require(path.join(__dirname, '../../Core/models/'));
const {Groups} = require(path.join(__dirname, '../../Core/models/'));
const {Channels} = require(path.join(__dirname, '../../Core/models/'));
const {Series} = require(path.join(__dirname, '../../Core/models/'));
const {Sessons} = require(path.join(__dirname, '../../Core/models/'));

module.exports = {

    generateStrmMovies: async (request, h) => {

      const channels = await Channels.findAll({
          where: {
              tvgtype: 'movies',
          },
      });

      if (!fs.existsSync(path.join(__dirname, `../Storage/emby`))){
          fs.mkdirSync(path.join(__dirname, `../Storage/emby`));
      }

      if (!fs.existsSync(path.join(__dirname, `../Storage/emby/Movies`))){
          fs.mkdirSync(path.join(__dirname, `../Storage/emby/Movies`));
      }

      for (const channel of channels) {
        let filename = `${channel.name}.strm`
        let filename1 = filename.replace(/\//g, " ");
        let filename2 = filename1.replaceAll("/\\/", " ");
        let stream = fs.createWriteStream(path.join(__dirname, `../Storage/emby/Movies/${filename2}`));
        stream.write(channel.url);
        stream.end();
      }
    },

    generateStrmTvShows: async (request, h) => {

      if (!fs.existsSync(path.join(__dirname, `../Storage/emby`))){
          fs.mkdirSync(path.join(__dirname, `../Storage/emby`));
      }

      if (!fs.existsSync(path.join(__dirname, `../Storage/emby/TVShows`))){
          fs.mkdirSync(path.join(__dirname, `../Storage/emby/TVShows`));
      }

      const series = await Series.findAll();
      for (const serie of series) {

        if (!fs.existsSync(path.join(__dirname, `../Storage/emby/TVShows/${serie.name}`))){
            fs.mkdirSync(path.join(__dirname, `../Storage/emby/TVShows/${serie.name}`));
        }

        let sessons = await Sessons.findAll({where: { SeriesId: serie.id }});

        for (let sesson of sessons) {
          if (!fs.existsSync(path.join(__dirname, `../Storage/emby/TVShows/${serie.name}/${sesson.name}`))){
              fs.mkdirSync(path.join(__dirname, `../Storage/emby/TVShows/${serie.name}/${sesson.name}`));
          }

          let episodes = await Channels.findAll({
              where: {
                  SeriesId: serie.id,
                  SessonId: sesson.id,
              },
          });

          for (let episode of episodes) {

            let episodeNumber = episode.episode;
            if (parseInt(episode.episode) < 10) {
              episodeNumber = `0${episodeNumber}`;
            }

            let seasonNumber = sesson.season
            if (parseInt(sesson.season) < 10) {
              seasonNumber = `0${seasonNumber}`;
            }

            let filename = `${episode.name} s${seasonNumber}e${episodeNumber}.strm`
            let filename1 = filename.replaceAll(/\//g, " ");
            let filename2 = filename1.replaceAll("\\", " ");
            let stream = fs.createWriteStream(path.join(__dirname, `../Storage/emby/TVShows/${serie.name}/${sesson.name}/${filename2}`));
            stream.write(episode.url);
            stream.end();
          }
        }
      }


    },
}
