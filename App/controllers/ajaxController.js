const path = require("path");
const { Op } = require("sequelize");
const {Channels} = require(path.join(__dirname, '../../Core/models/'));
const {Groups} = require(path.join(__dirname, '../../Core/models/'));
const {ChannelGroups} = require(path.join(__dirname, '../../Core/models/'));

module.exports = {
  globalSearch: async(request, h) => {
    let html = `<ul class="dropdown-menu dropdown-menu-end px-2 py-3 me-sm-n2 show" aria-labelledby="dropdownMenuButton" data-bs-popper="static" id="resultsofsearch">`
    let results = await Channels.findAll(
        {
            limit: 10,
            where: {
                name: {
                  [Op.like]:  `%${request.query.query}%`
                }
            },
        }
      );

    if (results.length < 1) {
      html += `
        <li class="mb-2">
          <a class="dropdown-item border-radius-md" href="javascript:;">
            <div class="d-flex py-1">
              <div class="d-flex flex-column justify-content-center">
                <h6 class="text-sm font-weight-normal mb-1">
                  <span class="font-weight-bold">No Results Found</span>
                </h6>
              </div>
            </div>
          </a>
        </li>`;
    }

    for (const result of results) {
      let url = '';

      if (result.tvgtype === 'movies') {
        url = `/movies/0/new/${result.id}`
      }

      if (result.tvgtype === 'series') {
        url = `/episode/new/${result.SessonId}/${result.id}`
      }

      if (result.tvgtype === 'live') {
        url = `/channels/${result.GroupId}/edit/${result.id}`
      }

      html += `
        <li class="mb-2">
          <a class="dropdown-item border-radius-md" href="${url}">
            <div class="d-flex py-1">
              <div class="my-auto">
                <img src="${result.logo}" class="avatar avatar-sm me-3 border-radius-lg">
              </div>
              <div class="d-flex flex-column justify-content-center">
                <h6 class="text-sm font-weight-normal mb-1">
                  <span class="font-weight-bold">${result.name}</span>
                </h6>
                <p class="text-xs text-secondary mb-0">
                  <i class="fa fa-clock me-1" aria-hidden="true"></i>
                  ${result.tvgtype}
                </p>
              </div>
            </div>
          </a>
        </li>`;
    }

    html += '</ul>';
    return html;
  },
}
