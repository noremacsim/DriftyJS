const path = require("path");
const bcrypt = require('bcrypt');
const {User} = require(path.join(__dirname, '../../Core/models/'));
const {ValidationError} = require('sequelize');
const Boom = require('boom')

module.exports = {

    login: async (request, h) => {

        if (!request.payload.username || !request.payload.password) {
            throw Boom.badRequest('Request missing username or password param')
        }

        const {username, password} = request.payload;

        try {
            let user = await User.authenticate(username, password, request)

            return h.response(user).code(200)

        } catch (err) {
            throw Boom.badRequest('invalid username or password')
        }
    },

    register: async (request, h) => {

        if (!request.payload.password) {
            let error = {
                message: 'Password Required',
                status: 400,
                success: false,
            }
            return h.response(error).code(400)
        }

        const hash = bcrypt.hashSync(request.payload.password, 10);

        try {
            // create a new user with the password hash from bcrypt
            let user = await User.create(
                Object.assign(request.payload, { password: hash })
            );

            // data will be an object with the user and it's authToken
            let data = await user.authorize(request);

            return h.response(data).code(200)

        } catch(err) {
            if(err instanceof ValidationError) {
                let error = {
                    message: err.errors[0].message,
                    status: 400,
                    success: false,
                }
                return h.response(error).code(400)
            }
            console.log(err);
            return h.response('Invalid Request').code(400)
        }
    }
}