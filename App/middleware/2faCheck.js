const dotenv = require('dotenv');
const path = require('path');
const {Models} = require(path.join(__dirname, '../../Core/'));
const Boom = require('boom');

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
        token = request.state.jwt;
    }

    if (token && userAgent) {
        const authToken = await Models.AuthToken.findOne({
            where: {token, userAgent},
            include: Models.User,
        });

        if (!authToken) {
            h.unstate('jwt');
            h.unstate('isLoggedIn');
            h.unstate('twoFAPassed');
            throw Boom.unauthorized('Access Denied');
            //return false;
        }

        const user = await Models.User.findOne({
            where: {id: authToken.User.id},
            include: [
                {model: Models.Company},
                {model: Models.Group},
                {model: Models.TwoFactorAuthentication},
                {model: Models.AuthToken},
            ],
        });

        h.state('twoFAPassed', true);
        h.state('isLoggedIn', true);
        global.userID = false;
        request.user = user;
        return true;
    } else {
        h.unstate('jwt');
        h.unstate('isLoggedIn');
        h.unstate('twoFAPassed');
        throw Boom.unauthorized('Access Denied');
        //return false;
    }
}

module.exports.name = 'twofaCheck';
module.exports.function = middle;
