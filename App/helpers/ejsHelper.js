module.exports.name = 'ejsHelpers';
module.exports.functions = {
    isLoggedIn: function (request) {
        return request.state.isLoggedIn;
    },
    twoFAPassed: function (request) {
        return request.state.twoFAPassed;
    },
};
