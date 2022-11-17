const dotenv = require("dotenv");
const path = require("path");
const { User, AuthToken, Company, Group, TwoFactorAuthentication } = require(path.join(__dirname, '../../Core/models/'));
const Boom = require('boom')

dotenv.config();

//TODO: Possibly check token expiry and create new one.
async function middle(request) {

    let userAgent = request.headers['user-agent'];
    let token = null;

    if (request.headers.authorization) {
        if (request.headers.authorization.startsWith("Bearer ")) {
            token = request.headers.authorization.substring(7, request.headers.authorization.length);
        }
    } else if (request.state.jwt) {
        token = request.state.jwt;
    } else if (request.auth.credentials) {
        token = request.state.jwt;
    }

    console.log(token);

    if (token && userAgent) {

        const authToken = await AuthToken.findOne(
            { where: { token, userAgent}, include: User}
        );

        if (!authToken) {
            global.isLoggedIn = false;
            throw Boom.unauthorized('Access Denied');
            //return false;
        }

        if (authToken.User.TwoFAEnabled && !authToken.TwoFactorPassed) {
            throw Boom.unauthorized('Not Passed 2fa');
        }

        const user = await User.findOne({
            where: { id:  authToken.User.id},
            include: [
                { model: Company },
                { model: Group },
                { model: TwoFactorAuthentication },
                { model: AuthToken },
            ]
        });

        global.isLoggedIn = true;
        global.userID = true;
        request.user = user;
        request.auth.isAuthenticated = true;
        request.auth.credentials = token;
        return true;
    } else {
        global.isLoggedIn = false;
        throw Boom.unauthorized('Access Denied');
        //return false;
    }
}

module.exports.name = 'auth';
module.exports.function = middle;
