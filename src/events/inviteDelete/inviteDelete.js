//https://discord.gg/8svs8AWA
require("dotenv").config();
const fs = require('fs');
const path = require("path");
const jsonFileName = path.join(
    __dirname,
    "..",
    "..",
    "assets",
    "invites.json"
);
const {
    EmbedBuilder
} = require("discord.js");
const { saveCache, loadCache } = require("../../utils/functions");

module.exports = (client, invite) => {
    var cache = loadCache();

    Object.entries(cache.userJoins).forEach(([userId, code]) => {
        if (code === invite.code) {
            delete cache.userJoins[userId];
        }
    });

    delete cache.invites[invite.code];

    saveCache(cache);
};