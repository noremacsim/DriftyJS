"use strict";

module.exports = async (request, h) => {
    return h.view('home', {notes: []});
};