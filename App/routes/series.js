const path = require("path");
const series = require(path.join(__dirname, '../controllers/seriesController'));
const sessons = require(path.join(__dirname, '../controllers/sessonsController'));
const {middleware} = require(path.join(__dirname, '../../Core/middleware'));

module.exports = [
  {
      method: "GET",
      path: "/series",
      handler: series.view,
      config: {
          pre: [{ method: middleware.auth }],
          description: "Gets all the groups available",
      }
  },
  {
      method: "GET",
      path: "/series/edit/",
      handler: series.editView,
      config: {
          pre: [{ method: middleware.auth }],
          description: "New series",
      }
  },
  {
      method: "POST",
      path: "/series/edit/",
      handler: series.editSave,
      config: {
          pre: [{ method: middleware.auth }],
          description: "Save series",
      }
  },
  {
      method: "GET",
      path: "/series/edit/{seriesID}",
      handler: series.editView,
      config: {
          pre: [{ method: middleware.auth }],
          description: "New series",
      }
  },
  {
      method: "POST",
      path: "/series/edit/{seriesID}",
      handler: series.editSave,
      config: {
          pre: [{ method: middleware.auth }],
          description: "Save series",
      }
  },
  {
      method: "GET",
      path: "/series/delete/{seriesID}",
      handler: series.deleteSeries,
      config: {
          pre: [{ method: middleware.auth }],
          description: "Delete series",
      }
  },
  {
      method: "GET",
      path: "/series/{seriesID}",
      handler: sessons.view,
      config: {
          pre: [{ method: middleware.auth }],
          description: "Gets all the sessons in the series",
      }
  },
]
