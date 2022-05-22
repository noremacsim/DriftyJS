const Slugify = require("slug");
const path = require("path");
const {Note} = require(path.join(__dirname, '../lib/models/'));

module.exports = {

    create: async (request, h) => {
        const result = await Note.create({
            date: new Date(),
            title: request.payload.noteTitle,
            slug: Slugify(request.payload.noteTitle, { lower: true }),
            description: request.payload.noteDescription,
            content: request.payload.noteContent
        });

        // Generate a new note with the 'result' data
        return result;
    },

    view: async (request, h) => {
        const note = await Note.findOne({
            where: {
                slug: request.params.slug
            }
        });

        return note;
    },

    update: async (request, h) => {
        const values = {
            title: request.payload.noteTitle,
            description: request.payload.noteDescription,
            content: request.payload.noteContent
        };

        const options = {
            where: {
                slug: request.params.slug
            }
        };

        await Note.update(values, options);
        const result = await Note.findOne(options);

        return result;
    },

    delete: async (request, h) => {
        await Note.destroy({
            where: {
                slug: request.params.slug
            }
        });

        return h.redirect("/");
    }
};