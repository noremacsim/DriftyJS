const dotenv = require("dotenv");
const path = require("path");
const { User, AuthToken } = require(path.join(__dirname, '../../Core/models/'));
const Boom = require('boom')

dotenv.config();

//TODO: Possibly check token expiry and create new one.
async function middle(request) {

    let userAgent = request.headers['user-agent']
    let token = request.state.jwt;

    if (token && userAgent) {

        const authToken = await AuthToken.findOne(
            { where: { token, userAgent}, include: User}
        );

        if (!authToken) {
            global.isLoggedIn = false;
            return false;
        }

        global.isLoggedIn = true;
        global.userID = true;
        return true;
    } else {
        global.isLoggedIn = false;
        return false;
    }
}

module.exports.name = 'auth';
module.exports.function = middle;
