const dotenv = require("dotenv");
const path = require("path");
const { User, AuthToken } = require(path.join(__dirname, '../../Core/models/'));
const Boom = require('boom')

dotenv.config();

async function middle(request) {

    let userAgent = request.headers['user-agent']
    let token = request.state[process.env.SESSION_NAME]['token'] || request.headers.authorization;

    if (token && userAgent) {

        token = token.replace('Bearer ','');

        const authToken = await AuthToken.findOne(
            { where: { token, userAgent}, include: User}
        );

        if (!authToken) {
            throw Boom.unauthorized('You cannot access this resource')
        }

        return true;
    } else {
        throw Boom.unauthorized('You cannot access this resource')
    }
}

module.exports.name = 'auth';
module.exports.function = middle;