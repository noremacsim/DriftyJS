module.exports = {
    name: 'public',

    home: async (request, h) => {
        return h.fullView('welcome', null);
    },
};
