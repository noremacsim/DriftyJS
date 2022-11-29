const path = require('path');
const {Company, Group} = require(path.join(__dirname, '../../Core/models/'));
const {ValidationError} = require('sequelize');
const Boom = require('boom');

module.exports = {
    newCompany: async (request, h) => {
        if (!request.payload.name) {
            throw Boom.badRequest('Company Name Required');
        }

        let name = request.payload.name;

        try {
            // create a new user with the password hash from bcrypt
            let company = await Company.create({name: name});

            return h.response(company).code(200);
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

        if (!request.payload.CompanyID) {
            throw Boom.badRequest('CompanyID Required');
        }

        let UserID = request.payload.UserID;
        let CompanyID = request.payload.CompanyID;

        try {
            const user = await User.findOne({where: {id: UserID}});

            let company = await Company.findOne({where: {id: CompanyID}});

            user.addCompany(company);

            return h.response('User Assigned to Company').code(200);
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

        if (!request.payload.CompanyID) {
            throw Boom.badRequest('CompanyID Required');
        }

        let UserID = request.payload.UserID;
        let CompanyID = request.payload.CompanyID;

        try {
            const user = await User.findOne({where: {id: UserID}});

            let company = await Company.findOne({where: {id: CompanyID}});

            user.removeCompany(company);

            return h.response('User Removed from Company').code(200);
        } catch (err) {
            if (err instanceof ValidationError) {
                throw Boom.badRequest(err.errors[0].message);
            }
            throw Boom.badRequest('Invalid Request');
        }
    },

    addGroup: async (request, h) => {
        if (!request.payload.GroupID) {
            throw Boom.badRequest('GroupID Required');
        }

        if (!request.payload.CompanyID) {
            throw Boom.badRequest('CompanyID Required');
        }

        let GroupID = request.payload.GroupID;
        let CompanyID = request.payload.CompanyID;

        try {
            const group = await Group.findOne({where: {id: GroupID}});

            let company = await Company.findOne({where: {id: CompanyID}});

            group.addCompany(company);

            return h.response('Group Assigned to Company').code(200);
        } catch (err) {
            if (err instanceof ValidationError) {
                throw Boom.badRequest(err.errors[0].message);
            }
            throw Boom.badRequest('Invalid Request');
        }
    },

    removeGroup: async (request, h) => {
        if (!request.payload.GroupID) {
            throw Boom.badRequest('GroupID Required');
        }

        if (!request.payload.CompanyID) {
            throw Boom.badRequest('CompanyID Required');
        }

        let GroupID = request.payload.GroupID;
        let CompanyID = request.payload.CompanyID;

        try {
            const group = await Group.findOne({where: {id: GroupID}});

            let company = await Company.findOne({where: {id: CompanyID}});

            group.removeCompany(company);

            return h.response('Group removed from Company').code(200);
        } catch (err) {
            if (err instanceof ValidationError) {
                throw Boom.badRequest(err.errors[0].message);
            }
            throw Boom.badRequest('Invalid Request');
        }
    },
};
