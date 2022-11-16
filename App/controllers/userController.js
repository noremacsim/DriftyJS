const path = require("path");
const bcrypt = require('bcrypt');
const {User, TwoFactorAuthentication} = require(path.join(__dirname, '../../Core/models/'));
const {ValidationError} = require('sequelize');
const Boom = require('boom');
const auth = require(path.join(__dirname, '../middleware/auth'));

module.exports = {

    signinView: async (request, h) => {
        if (await auth.function(request)) {
            return h.redirect('/');
        }
        return h.simsView('signin');
    },

    login: async (request, h) => {

        if (!request.payload.username || !request.payload.password) {
            global.isLoggedIn = false;
            throw Boom.badRequest('Request missing username or password param')
        }

        const {username, password} = request.payload;

        try {
            let user = await User.authenticate(username, password, request)

            h.state('jwt', user.authToken['token']);

            return h.response({
                jwt: user.authToken['token'],
                twofa: user.user['TwoFAEnabled']
            }).code(200);

        } catch (err) {
            global.isLoggedIn = false;
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
            return h.response('Invalid Request').code(400)
        }
    },

    logout: async (request, h) => {
        h.state('jwt', '');
        User.logout(request)
        return h.response({success: 'Logged Out'}).code(200);
    },

    details: async (request, h) => {
        return h.response(request.user).code(200);
    },

    update: async (request, h) => {
        let {email, username, password, firstname, middlename, lastname} = request.payload;

        let updateValues = {};

        if (firstname) {
            updateValues['firstName'] = firstname;
        }

        if (middlename) {
            updateValues['middleName'] = middlename;
        }

        if (lastname) {
            updateValues['lastName'] = lastname;
        }

        if (username) {
            updateValues['username'] = username;
        }

        if (email) {
            updateValues['email'] = email;
        }

        if (password) {
            updateValues['password'] = bcrypt.hashSync(password, 10);
        }

        return await User.update(updateValues,
            {
                where: {id: request.user.id}
            }
        );
    },

    new2Fa: async (request, h) => {
        const twoFa = TwoFactorAuthentication.generate(request.user, request.headers);
        return h.response(twoFa).code(200);
    },

    enable2Fa: async (request, h) => {
        let user = request.user
        const token = request.payload.token;
        if (await TwoFactorAuthentication.validate(user, token, request.headers))
        {
            return h.response({success: '2Fa Passed'}).code(200);
        } else {
            return h.response({failed: 'Code Not Accepted'}).code(400);
        }
    },
}
