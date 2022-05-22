"use strict";
const {Note} = require("../../Core/models");

module.exports = async (request, h) => {
    const allNotes = await Note.findAll({
        order: [["date", "DESC"]]
    });

    return h.view('home', {notes: allNotes});
};