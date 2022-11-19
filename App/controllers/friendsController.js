const path = require("path");
const {Group, User, Friends} = require(path.join(__dirname, '../../Core/models/'));
const {ValidationError} = require('sequelize');
const Boom = require('boom');

module.exports = {

    newRequest: async (request, h) => {

        if (!request.payload.friend_ID) {
            throw Boom.badRequest('We need a friend_Id')
        }

        let friendID = request.payload.friend_ID;

        try {

            // create a new user with the password hash from bcrypt
            let friend = await Friends.create(
                {
                    User_ID: request.user.id,
                    friend_ID: friendID,
                    confirmed: false,
                    type: 'friend',
                }
            );

            return h.response(friend).code(200)

        } catch(err) {
            if(err instanceof ValidationError) {
                throw Boom.badRequest(err.errors[0].message);

            }
            throw Boom.badRequest('Invalid Request');
        }
    },

    acceptRequest: async (request, h) => {

        if (!request.payload.friend_ID) {
            throw Boom.badRequest('We need a friend_Id')
        }

        let friendID = request.payload.friend_ID;

        try {
            const sentRequest = await Friends.findOne(
                {
                    where: {
                        User_ID: friendID,
                        friend_ID: request.user.id,
                    }
                }
            );

            sentRequest.confirmed = true;
            sentRequest.save();

            let friend = await Friends.create(
                {
                    User_ID: request.user.id,
                    friend_ID: friendID,
                    confirmed: false,
                    type: 'friend',
                }
            );

            return h.response(friend).code(200)

        } catch(err) {
            if(err instanceof ValidationError) {
                throw Boom.badRequest(err.errors[0].message);
            }
            throw Boom.badRequest('Invalid Request');
        }
    },

    removeFriend: async (request, h) => {

        if (!request.payload.friend_ID) {
            throw Boom.badRequest('We need a friend_Id')
        }

        let friendID = request.payload.friend_ID;

        try {

            await Friends.destroy(
                {
                    where: {
                        User_ID: request.user.id,
                        friend_ID: friendID,
                    }
                }
            );

            await Friends.destroy(
                {
                    where: {
                        User_ID: friendID,
                        friend_ID: request.user.id,
                    }
                }
            );

            return h.response('Friend Removed').code(200)

        } catch(err) {
            if(err instanceof ValidationError) {
                throw Boom.badRequest(err.errors[0].message);

            }
            throw Boom.badRequest('Invalid Request');
        }
    },

}
