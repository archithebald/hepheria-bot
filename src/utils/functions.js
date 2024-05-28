require("dotenv").config()
const {
    EmbedBuilder
} = require('@discordjs/builders');
const {
    Colors
} = require('discord.js');
const fs = require('fs');
const path = require("path");
const yaml = require('js-yaml');

let defaultCache = {
    invites: new Map(),
    userJoins: new Map()
};

const giveawayFile = path.join(
    __dirname,
    "..",
    "assets",
    "giveaway.json"
);

const invitesFile = path.join(
    __dirname,
    "..",
    "assets",
    "invites.json"
);

function getClientAvatar(client) {
    const id = client.user.id
    const avatar = client.user.avatar

    const avatarUrl = `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp?size=160`;
    return avatarUrl;
}

function deleteData(i) {
    const data = fs.readFileSync(giveawayFile);
    const jsonData = JSON.parse(data);

    jsonData.giveaways.splice(i, 1);

    fs.writeFileSync(giveawayFile, JSON.stringify(jsonData));
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

async function rollWinners(channel, messageId, client, winnersNumber) {
    const msg = await channel.messages.fetch(messageId);
    const usersTable = [];

    await Promise.all(msg.reactions.cache.map(async (reaction) => {
        const users = await reaction.users.fetch();
        users.forEach(user => {
            if (user.id !== client.user.id) {
                usersTable.push(user);
            }
        });
    }));

    const winners = [];

    winnersNumber = winnersNumber || 1;

    for (let x = 0; x < winnersNumber; x++) {
        const randomIndex = Math.floor(Math.random() * usersTable.length);
        const winner = usersTable.splice(randomIndex, 1)[0];
        winners.push(winner);
    }

    return winners;
}


function readConfig(env="dev") {
    const configFile = fs.readFileSync(path.join(__dirname, '..', `config/${env}.yaml`), 'utf8');

    const config = yaml.load(configFile);

    return config;
}

function writeConfig(env, newConfig) {
    const filePath = path.join(__dirname, '..', `config/${env}.yaml`);
    fs.writeFileSync(filePath, yaml.dump(newConfig));
}

async function timeIsUp(i, client, options, messageId) {
    const config = readConfig(process.env.ENVIRONMENT);

    const GIVEAWAY_CHANNEL = config.CHANNELS.GIVEAWAY_CHANNEL

    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const channel = guild.channels.cache.get(GIVEAWAY_CHANNEL);

    const title = (options.get && options.get("titre") && options.get("titre").value) || options.title;
    const winnersNumber = (options.get && options.get("gagnants") && options.get("gagnants").value) || options.winners;

    const winners = await rollWinners(channel, messageId, client, winnersNumber);

    const embed = new EmbedBuilder()
        .setColor(Colors.NotQuiteBlack)
        .setTitle(title)
        .setDescription(`Gagnant(s): ${winners}`);

    channel.send({
        content: `🎉 **FIN DU GIVEAWAY** 🎉`,
        embeds: [embed],
    })

    deleteData(i)

    console.log("Time's up!");
}

function updateTimestamp(remainingTimeInSeconds) {
    const hours = Math.floor(remainingTimeInSeconds / 3600);
    const minutes = Math.floor((remainingTimeInSeconds % 3600) / 60);
    const seconds = remainingTimeInSeconds % 60;

    return `${hours}H:${minutes}M:${seconds}S`;
}

function loadCache() {
    const _path = "src/assets/cache.json";

    if (fs.existsSync(_path)) {
        const data = fs.readFileSync(_path, 'utf-8');
        
        if (data) {
            var cache = JSON.parse(data);

            if (!cache["invites"]) {
                cache = defaultCache
            }
        }

        return cache;
    }
}

function saveCache(cache) {
    const _path = "src/assets/cache.json";

    const data = JSON.stringify(cache);
    fs.writeFileSync(_path, data);
}

module.exports = {
    timeIsUp,
    getClientAvatar,
    readConfig,
    writeConfig,
    updateTimestamp,
    saveCache,
    loadCache
}