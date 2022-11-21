const path = require("path");
const {sequelize} = require(path.join(__dirname, '../../Core/models/'));
const { QueryTypes } = require('sequelize');

module.exports = {

    posts: async (request, h, raw = false) => {
        // We should group the users from company then group then firends to get posts
        // If a user is part of a company/group we should return global posts in that scope

        let posts = await sequelize.query(
            'SELECT Posts.id, Posts.content, Posts.createdAt, Users.username, Users.id as UserID FROM Posts' +
            ' LEFT JOIN Friends as Friends ON `Friends`.`User_ID` = :currentUserId' +
            ' LEFT JOIN Users as Users ON `Users`.`id` = `Friends`.`friend_ID`' +
            ' WHERE `UserId` = `Friends`.`friend_ID`' +
            ' AND `Friends`.`confirmed` = 1', {
                replacements: { currentUserId: request.user.id },
                logging: console.log,
                raw: true,
                type: QueryTypes.SELECT
            }
        );

        return h.response(posts).code(200);
    }

}
