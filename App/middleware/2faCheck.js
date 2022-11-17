const dotenv = require("dotenv");
const path = require("path");
const { User, AuthToken, Company, Group, TwoFactorAuthentication } = require(path.join(__dirname, '../../Core/models/'));
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
            throw Boom.unauthorized('Access Denied');
            //return false;
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

        global.isLoggedIn = false;
        global.userID = false;
        request.user = user;
        return true;
    } else {
        global.isLoggedIn = false;
        throw Boom.unauthorized('Access Denied');
        //return false;
    }
}

module.exports.name = 'twofaCheck';
module.exports.function = middle;
