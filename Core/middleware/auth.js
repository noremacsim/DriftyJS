const dotenv = require('dotenv');
const path = require('path');
const {
    User,
    AuthToken,
    Company,
    Group,
    TwoFactorAuthentication,
} = require(path.join(__dirname, '../../Core/models/'));
const {Helpers} = require(path.join(__dirname, `../../Core/`));

dotenv.config();

//TODO: Possibly check token expiry and create new one.
async function middle(request, h) {
    let userAgent = request.headers['user-agent'];
    let token = null;

    if (request.headers.authorization) {
        if (request.headers.authorization.startsWith('Bearer ')) {
            token = request.headers.authorization.substring(
                7,
                request.headers.authorization.length
            );
        }
    }

    if (!token && request.state.jwt) {
        token = request.state.jwt;
    } else if (request.auth.credentials) {
        token = request.auth.credentials;
    }

    // Check if path exists in routes
    let requestedPath = Helpers.path.exists(request, h);

    if (token && userAgent) {
        const authToken = await AuthToken.findOne({
            where: {token, userAgent},
            include: User,
        });

        if (!authToken) {
            h.unstate('jwt');
            h.unstate('isLoggedIn');
            h.unstate('twoFAPassed');
            return h.redirect(`/user/login?path=${requestedPath}`);
        }

        if (authToken.User.TwoFAEnabled && !authToken.TwoFactorPassed) {
            h.state('twoFAPassed', false);
            h.state('isLoggedIn', true);
            request.user = {};
            request.user.id = authToken.User.id;
            return h.redirect(`/user/login?path=${requestedPath}`);
        }

        const user = await User.findOne({
            where: {id: authToken.User.id},
            include: [
                {model: Company},
                {model: Group},
                {model: TwoFactorAuthentication},
                {model: AuthToken},
            ],
        });

        h.state('twoFAPassed', true);
        h.state('isLoggedIn', true);
        global.userID = true;
        request.user = user;
        request.auth.isAuthenticated = true;
        request.auth.credentials = token;
        return 'passed';
    } else {
        h.unstate('jwt');
        h.unstate('isLoggedIn');
        h.unstate('twoFAPassed');
        return h.redirect(`/user/login?path=${requestedPath}`);
    }
}

module.exports.name = 'auth';
module.exports.function = middle;
