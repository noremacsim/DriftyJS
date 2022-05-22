const path = require("path");
const Note = require(path.join(__dirname, '../controllers/notesController'));

module.exports = [
    {
        method: "POST",
        path: "/note",
        handler: Note.create,
        config: {
            description: "Adds a new note",
        }
    },
    {
        method: "GET",
        path: "/note/{slug}",
        handler: Note.view,
        config: {
            description: "Gets the content of a note"
        }
    },
    {
        method: "PUT",
        path: "/note/{slug}",
        handler: Note.update,
        config: {
            description: "Updates the selected note",
        }
    },
    {
        method: "GET",
        path: "/note/{slug}/delete",
        handler: Note.delete,
        config: {
            description: "Deletes the selected note"
        }
    }
];