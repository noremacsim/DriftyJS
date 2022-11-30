module.exports = {
    name: 'public',

    home: async (request, h) => {
        return h.view('core/pages/welcome', null);
    },
};
