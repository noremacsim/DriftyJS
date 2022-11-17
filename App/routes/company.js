const path = require("path");
const Company = require(path.join(__dirname, '../controllers/companyController'));
const {middleware} = require(path.join(__dirname, '../../Core/middleware'));

module.exports = [
    {
        method: "POST",
        path: "/company/new",
        handler: Company.newCompany,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Create New Company",
        }
    },
    {
        method: "POST",
        path: "/company/user/add",
        handler: Company.addUser,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Assign User to a Company",
        }
    },
    {
        method: "POST",
        path: "/company/user/remove",
        handler: Company.removeUser,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Remove a user from Company",
        }
    },
    {
        method: "POST",
        path: "/company/group/add",
        handler: Company.addGroup,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Assign Group to a Company",
        }
    },
    {
        method: "POST",
        path: "/company/group/remove",
        handler: Company.removeGroup,
        config: {
            pre: [{ method: middleware.auth }],
            description: "Remove a group from Company",
        }
    },
];
