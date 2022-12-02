const path = require('path');
const {Controllers, Middleware} = require(path.join(__dirname, '../../Core/'));

module.exports = [
    {
        method: 'POST',
        path: '/admin/company/new',
        handler: Controllers.company.newCompany,
        config: {
            pre: [{method: Middleware.apiAuth}],
            description: 'Create New Company',
        },
    },
    {
        method: 'POST',
        path: '/admin/company/user/add',
        handler: Controllers.company.addUser,
        config: {
            pre: [{method: Middleware.apiAuth}],
            description: 'Assign User to a Company',
        },
    },
    {
        method: 'POST',
        path: '/admin/company/user/remove',
        handler: Controllers.company.removeUser,
        config: {
            pre: [{method: Middleware.apiAuth}],
            description: 'Remove a user from Company',
        },
    },
    {
        method: 'POST',
        path: '/admin/company/group/add',
        handler: Controllers.company.addGroup,
        config: {
            pre: [{method: Middleware.apiAuth}],
            description: 'Assign Group to a Company',
        },
    },
    {
        method: 'POST',
        path: '/admin/company/group/remove',
        handler: Controllers.company.removeGroup,
        config: {
            pre: [{method: Middleware.apiAuth}],
            description: 'Remove a group from Company',
        },
    },
];
