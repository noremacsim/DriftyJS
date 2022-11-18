
module.exports = {
    isLoggedIn: function(request) {
        return request.state.isLoggedIn;
    },
    twoFAPassed: function(request) {
        return request.state.twoFAPassed;
    },
};
