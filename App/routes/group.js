const path = require('path');
const {Controllers, Middleware} = require(path.join(__dirname, '../../Core/'));

module.exports = [
    {
        method: 'POST',
        path: '/admin/group/new',
        handler: Controllers.group.newGroup,
        config: {
            pre: [{method: Middleware.apiAuth}],
            description: 'Create New Group',
        },
    },
    {
        method: 'POST',
        path: '/admin/group/user/add',
        handler: Controllers.group.addUser,
        config: {
            pre: [{method: Middleware.apiAuth}],
            description: 'Assign User to a Group',
        },
    },
    {
        method: 'POST',
        path: '/admin/group/user/remove',
        handler: Controllers.group.removeUser,
        config: {
            pre: [{method: Middleware.apiAuth}],
            description: 'Remove a user from Group',
        },
    },
];
