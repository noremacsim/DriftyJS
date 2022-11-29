module.exports = {
    name: 'public',

    home: async (request, h) => {
        return h.view('welcome', null);
    },
};
