module.exports = {
    home: async (request, h) => {
        return h.fullView('welcome', null);
    },
};
