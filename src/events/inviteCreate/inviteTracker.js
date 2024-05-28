require("dotenv").config();
const path = require("path");
const {
    saveCache,
    loadCache
} = require("../../utils/functions");

module.exports = (client, invite) => {
    var cache = loadCache();

    cache.invites[invite.code] = {
        invite: invite,
        uses: invite.uses,
        fake: 0,
        leave: 0,
    }

    saveCache(cache);
};