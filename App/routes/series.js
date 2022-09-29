const path = require("path");
const series = require(path.join(__dirname, '../controllers/seriesController'));
const sessons = require(path.join(__dirname, '../controllers/sessonsController'));
const groups = require(path.join(__dirname, '../controllers/groupsController'));
const {middleware} = require(path.join(__dirname, '../../Core/middleware'));

module.exports = [
  {
      method: "GET",
      path: "/groups/series",
      handler: groups.series,
      config: {
          pre: [{ method: middleware.auth }],
          description: "Gets all the groups available",
      }
  },
  {
      method: "GET",
      path: "/series/{groupID}",
      handler: series.viewByGroup,
      config: {
          pre: [{ method: middleware.auth }],
          description: "Gets all the groups available",
      }
  },
  {
      method: "GET",
      path: "/series/{groupID}/edit/",
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
      path: "/series/{groupID}/edit/{seriesID}",
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
      path: "/series/{groupID}/{seriesID}",
      handler: sessons.view,
      config: {
          pre: [{ method: middleware.auth }],
          description: "Gets all the sessons in the series",
      }
  },
]
