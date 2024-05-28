const { loadCache, saveCache } = require("../../utils/functions")

function isWeekOld(member) {
    const accountCreationDate = member.user.createdAt;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return accountCreationDate < oneWeekAgo;
}

module.exports = async (client, member) => {
    var cache = loadCache();

    var guild = await client.guilds.cache.get(process.env.GUILD_ID);

    var newInvites = await guild.invites.fetch();
    var oldInvites = cache.invites;

    var memberJoinedLink = cache?.userJoins[member.id] || undefined
    var weekOld = isWeekOld(member);

    newInvites.forEach(newInvite => {
        if (newInvite.uses != oldInvites[newInvite.code].uses && memberJoinedLink != newInvite.code) {
            if (!weekOld) {
                cache.invites[newInvite.code].fake += 1;
            } else {
                cache.invites[newInvite.code].uses += 1;
            }

            cache.userJoins[member.id] = newInvite.code
        }
    });

    saveCache(cache)
}