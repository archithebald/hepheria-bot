require("dotenv").config()
const {
    EmbedBuilder
} = require('discord.js');
const fs = require('fs');
const path = require("path");
const jsonFileName = path.join(
    __dirname,
    "..",
    "..",
    "assets",
    "giveaway.json"
);
const {
    timeIsUp,
    readConfig,
    updateTimestamp
} = require(path.join(__dirname, "..", "..", "utils", "functions.js"))

const config = readConfig(process.env.ENVIRONMENT)

module.exports = (client) => {
    const data = fs.readFileSync(jsonFileName);
    const jsonData = JSON.parse(data);

    jsonData.giveaways.forEach(async (obj, index) => {
        if (obj == null) {
            return
        }

        const unixEpochTime = Date.now();

        var msgId = obj.messageId;
        var winners = obj.winners;
        var mention = obj.mention?.role || obj.mention;
        var title = obj.title;

        var giveawayUnixEpochTime = obj.unixEpochTime;
        var timeLeft = Math.max(0, giveawayUnixEpochTime + obj.time - unixEpochTime);
        var timeLeftSeconds = Math.round(timeLeft / 1000)

        const guild = await client.guilds.cache.get(process.env.GUILD_ID);
        const channelId = config.CHANNELS.GIVEAWAY_CHANNEL
        const channel = await guild.channels.cache.get(channelId);
        const message = await channel.messages.fetch(msgId);

        const intervalId = setInterval(() => {
            timeLeftSeconds--

            const newEmbed = new EmbedBuilder()
                .setColor(config.COLORS.EMBED_COLOR)
                .setTitle(title)
                .setDescription(`Réagis avec 🎉 pour participer!\nSe termine dans: **${updateTimestamp(timeLeftSeconds)}**\n`)
                .setFooter({
                    text: `${winners} Gagnants | giveaway`,
                });

            var content = ""

            if (mention.id) {
                content = `<@&${mention.id}> \n \n🎉 **GIVEAWAY** 🎉`
            } else {
                content = `${mention} \n \n🎉 **GIVEAWAY** 🎉`
            }

            message.edit({
                embeds: [newEmbed],
                content: content,
            })
        }, 1000);

        setTimeout(() => {
            clearInterval(intervalId);
            timeIsUp(index, client, obj, msgId); // Passing the index to timeIsUp
        }, timeLeft);

        console.log("Timeout set ✔️ for index", index);
        console.log("Time left for index", index, ":", timeLeft);
    });
};