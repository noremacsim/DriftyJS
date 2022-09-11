const path = require("path");
const {User} = require(path.join(__dirname, '../../Core/models/'));
const {UserGroups} = require(path.join(__dirname, '../../Core/models/'));
const {Groups} = require(path.join(__dirname, '../../Core/models/'));

module.exports = {

    view: async (request, h) => {
        const users = await User.findAll();
        return h.view('users', {users: users, activePage: 'users'});
    },

    edit: async (request, h) => {
        const userID = request.params.userID;
        let user = [];
        let userGroups = [];
        if (userID) {
            user = await User.findOne({ where: { id: userID } });
            userGroups = await UserGroups.findAll({ where: { UserId: userID }, attributes: ["GroupId"], raw: true, nest: true })
                .then(function(userGroups) {
                    return userGroups.map(function(userGroups) { return userGroups.GroupId; })
                });
        }
        const groups = await Groups.findAll();
        return h.view('edituser', {user: user, userGroups: userGroups, groups: groups, activePage: 'users'});
    },

    saveEdit: async (request, h) => {
        let userID = request.params.userID
        const {username, userGroups, activeUser} = request.payload;

        let active = false
        if (activeUser) {
            active = true;
        }

        if (userID) {
            const updated = await User.update(
                {
                    username: username,
                    active: active,
                },
                {
                    where: {id: userID}
                }
            );
        } else {
            const newUser = await User.create(
                {
                    username: username,
                    active: active,
                }
            );
            userID = newUser.id;
        }

        await UserGroups.destroy({ where: { UserId: userID } });

        if (userGroups) {
            for (const groupId of userGroups) {
                await UserGroups.create({
                    UserId: userID,
                    GroupId: groupId,
                });
            }
        }

        return 'test';
    },

    deleteUser: async(request, h) => {
        let userID = request.params.userID
        await UserGroups.destroy({ where: { UserId: userID } });
        await User.destroy({ where: { id: userID } });
        return true;
    },
}