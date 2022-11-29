const path = require('path');
const {Group, User} = require(path.join(__dirname, '../../Core/models/'));
const {ValidationError} = require('sequelize');
const Boom = require('boom');

module.exports = {
    newGroup: async (request, h) => {
        if (!request.payload.name) {
            throw Boom.badRequest('Group Name Required');
        }

        let name = request.payload.name;

        try {
            // create a new user with the password hash from bcrypt
            let group = await Group.create({name: name});

            return h.response(group).code(200);
        } catch (err) {
            if (err instanceof ValidationError) {
                throw Boom.badRequest(err.errors[0].message);
            }
            throw Boom.badRequest('Invalid Request');
        }
    },

    addUser: async (request, h) => {
        if (!request.payload.UserID) {
            throw Boom.badRequest('UserID Required');
        }

        if (!request.payload.GroupID) {
            throw Boom.badRequest('GroupID Required');
        }

        let UserID = request.payload.UserID;
        let GroupID = request.payload.GroupID;

        try {
            const user = await User.findOne({where: {id: UserID}});

            let group = await Group.findOne({where: {id: GroupID}});

            user.addGroup(group);

            return h.response('User Assigned to Group').code(200);
        } catch (err) {
            if (err instanceof ValidationError) {
                throw Boom.badRequest(err.errors[0].message);
            }
            throw Boom.badRequest('Invalid Request');
        }
    },

    removeUser: async (request, h) => {
        if (!request.payload.UserID) {
            throw Boom.badRequest('UserID Required');
        }

        if (!request.payload.GroupID) {
            throw Boom.badRequest('GroupID Required');
        }

        let UserID = request.payload.UserID;
        let GroupID = request.payload.GroupID;

        try {
            const user = await User.findOne({where: {id: UserID}});

            let group = await Group.findOne({where: {id: GroupID}});

            user.removeGroup(group);

            return h.response('User Removed from Group').code(200);
        } catch (err) {
            if (err instanceof ValidationError) {
                throw Boom.badRequest(err.errors[0].message);
            }
            throw Boom.badRequest('Invalid Request');
        }
    },
};
