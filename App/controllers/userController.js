const path = require('path');
const bcrypt = require('bcrypt');
const {
    User,
    TwoFactorAuthentication,
    Company,
    Group,
    sequelize,
} = require(path.join(__dirname, '../../Core/models/'));
const {ValidationError} = require('sequelize');
const Boom = require('boom');

module.exports = {
    name: 'user',

    signinView: async (request, h) => {
        if (
            request.state.twoFAPassed === true &&
            request.state.isLoggedIn === true
        ) {
            return h.redirect(`/`);
        }

        if (
            request.state.twoFAPassed === false &&
            request.state.isLoggedIn === true
        ) {
            return h.simsView('user/2fa', {}, request);
        } else {
            return h.simsView('user/login', {}, request);
        }
    },

    settingsView: async (request, h) => {
        return h.simsView('user/settings', {}, request);
    },

    login: async (request, h) => {
        if (!request.payload.username || !request.payload.password) {
            h.state('isLoggedIn', false);
            throw Boom.badRequest('Request missing username or password param');
        }

        const {username, password} = request.payload;

        try {
            let user = await User.authenticate(username, password, request);

            h.state('jwt', user.authToken['token']);
            h.state('isLoggedIn', true);

            if (user.user['TwoFAEnabled']) {
                h.state('twoFAPassed', false);
            } else {
                h.state('twoFAPassed', true);
            }

            return h
                .response({
                    jwt: user.authToken['token'],
                    twofa: user.user['TwoFAEnabled'],
                    message: 'Successfully Logged in',
                })
                .code(200);
        } catch (err) {
            h.state('twoFAPassed', false);
            h.state('isLoggedIn', false);
            throw Boom.badRequest('invalid username or password');
        }
    },

    register: async (request, h) => {
        if (!request.payload.password) {
            let error = {
                message: 'Password Required',
                status: 400,
                success: false,
            };
            return h.response(error).code(400);
        }

        const hash = bcrypt.hashSync(request.payload.password, 10);

        try {
            // create a new user with the password hash from bcrypt
            let user = await User.create(
                Object.assign(request.payload, {password: hash})
            );

            // data will be an object with the user and it's authToken
            let data = await user.authorize(request);

            return h.response(data).code(200);
        } catch (err) {
            if (err instanceof ValidationError) {
                let error = {
                    message: err.errors[0].message,
                    status: 400,
                    success: false,
                };
                return h.response(error).code(400);
            }
            return h.response('Invalid Request').code(400);
        }
    },

    logout: async (request, h) => {
        h.unstate('jwt');
        h.unstate('twoFAPassed');
        h.unstate('isLoggedIn');
        User.logout(request);
        return h.response({success: 'Logged Out'}).code(200);
    },

    details: async (request, h) => {
        return h.response(request.user).code(200);
    },

    update: async (request, h) => {
        let {
            email,
            username,
            password,
            firstname,
            middlename,
            lastname,
            CompanyID,
            GroupIDs,
            oldPassword,
        } = request.payload;

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

        const user = await User.update(updateValues, {
            where: {id: request.user.id},
        });

        if (password) {
            if (oldPassword) {
                if (bcrypt.compareSync(oldPassword, request.user.password)) {
                    user.password = bcrypt.hashSync(password, 10);
                } else {
                    throw Boom.badRequest('You entered Incorrect Password');
                }
            } else {
                throw Boom.badRequest(
                    'You must pass your old password with the new'
                );
            }
        }

        if (CompanyID) {
            await sequelize.query(
                `DELETE FROM company_users WHERE UserID = ${request.user.id}`
            );

            let company = await Company.findOne({where: {id: CompanyID}});

            request.user.addCompany(company);
        }

        if (GroupIDs) {
            await sequelize.query(
                `DELETE FROM group_users WHERE UserID = ${request.user.id}`
            );

            for (const GroupID of GroupIDs) {
                let group = await Group.findOne({where: {id: GroupID}});

                request.user.addGroup(group);
            }
        }

        return h.response({message: 'Successfully Updated'}).code(200);
    },

    new2Fa: async (request, h) => {
        const twoFa = await TwoFactorAuthentication.generate(
            request.user,
            request.headers
        );
        return h.response(twoFa).code(200);
    },

    enable2Fa: async (request, h) => {
        let user = request.user;
        const token = request.payload.token;
        if (
            await TwoFactorAuthentication.validate(user, token, request.headers)
        ) {
            h.state('twoFAPassed', true);
            return h.response({message: '2fa passed'}).code(200);
        } else {
            h.state('twoFAPassed', false);
            return h
                .response({message: 'Authentication Code Incorrect'})
                .code(400);
        }
    },
};
