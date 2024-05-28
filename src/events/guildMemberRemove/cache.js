const {
    loadCache,
    saveCache
} = require("../../utils/functions")

function isWeekOld(member) {
    const accountCreationDate = member.user.createdAt;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return accountCreationDate < oneWeekAgo;
}

function isWeekOld(member) {
    const accountCreationDate = member.user.createdAt;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return accountCreationDate < oneWeekAgo;
}
module.exports = async (client, member) => {
    var cache = loadCache();

    var memberJoinedLink = cache?.userJoins[member.id] || undefined;
    var weekOld = isWeekOld(member);

    if (memberJoinedLink) {
        delete cache.userJoins[member.id];

        cache.invites[memberJoinedLink].leave += 1;
        cache.invites[memberJoinedLink].uses -= 1;

        if (!weekOld) {
            cache.invites[memberJoinedLink].fake -= 1;
        }
    }

    saveCache(cache);
}