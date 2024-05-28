require("dotenv").config()
const {
    loadCache,
    saveCache
} = require("../../utils/functions");
function getUses(cache, inviteCode) {
    const userJoins = cache.userJoins;

    let uses = 0;

    Object.entries(userJoins).forEach(([userId, code]) => {
        if (code === inviteCode) {
            uses += 1;
        }
    });

    return uses;
}

module.exports = async (client) => {
    var cache = loadCache()
    client.cache = cache;

    var guild = await client.guilds.cache.get(process.env.GUILD_ID)

    var invites = await guild.invites.fetch()

    invites.forEach(invite => {
        var uses = getUses(cache, invite.code)
        var fake = cache.invites[invite.code]?.fake || 0;
        var leave = cache.invites[invite.code]?.leave || 0;

        client.cache.invites[invite.code] = {
            invite: invite,
            uses: uses,
            fake: fake,
            leave: leave,
        }
    });

    saveCache(client.cache);
}