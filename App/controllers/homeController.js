const path = require("path");

module.exports = {

    main: async (request, h) => {
        return h.simsView('home/main', {}, request);
    }
}
