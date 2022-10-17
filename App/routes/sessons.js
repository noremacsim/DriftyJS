const path = require("path");
const series = require(path.join(__dirname, '../controllers/seriesController'));
const sessons = require(path.join(__dirname, '../controllers/sessonsController'));
const episodes = require(path.join(__dirname, '../controllers/episodesController'));
const {middleware} = require(path.join(__dirname, '../../Core/middleware'));

module.exports = [
  {
      method: "GET",
      path: "/seasons/edit/{seriesID}",
      handler: sessons.editView,
      config: {
          pre: [{ method: middleware.auth }],
          description: "New seasons",
      }
  },
  {
      method: "POST",
      path: "/seasons/edit/{seriesID}/",
      handler: sessons.editSave,
      config: {
          pre: [{ method: middleware.auth }],
          description: "Save sessons",
      }
  },
  {
      method: "GET",
      path: "/seasons/edit/{seriesID}/{sessonID}",
      handler: sessons.editView,
      config: {
          pre: [{ method: middleware.auth }],
          description: "New seasons",
      }
  },
  {
      method: "POST",
      path: "/seasons/edit/{seriesID}/{sessonID}",
      handler: sessons.editSave,
      config: {
          pre: [{ method: middleware.auth }],
          description: "Save seasons",
      }
  },
  {
      method: "GET",
      path: "/seasons/delete/{sessonID}",
      handler: sessons.deleteSessons,
      config: {
          pre: [{ method: middleware.auth }],
          description: "Delete seasons",
      }
  },
  {
      method: "GET",
      path: "/seasons/{sessonID}",
      handler: episodes.view,
      config: {
          pre: [{ method: middleware.auth }],
          description: "Gets all the sessons in the series",
      }
  },
]
