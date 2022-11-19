const path = require("path");
const Feed = require(path.join(__dirname, '../controllers/feedController'));

module.exports = {

    main: async (request, h) => {
        const posts = await Feed.posts(request, h, true);
        console.log(posts);
        return h.simsView('home/main', {posts: posts}, request);
    }
}
