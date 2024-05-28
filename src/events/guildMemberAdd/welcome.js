//https://discord.gg/8svs8AWA
require("dotenv").config();
const path = require("path");

const {
  EmbedBuilder
} = require("discord.js");
const {
  saveCache
} = require("../../utils/functions");
const {
  getClientAvatar,
  readConfig,
  updateInvite
} = require(path.join(__dirname, "..", "..", "utils", "functions.js"))
const config = readConfig(process.env.ENVIRONMENT)


module.exports = async (client, member) => {
  const WELCOME_CHANNEL = config.CHANNELS.WELCOME_CHANNEL;
  const JOINING_ROLE = config.ROLES.JOINING_ROLE;
  const MODS_ONLY_CHANNEL = config.CHANNELS.MODS_ONLY_CHANNEL;

  const welcomeImage = config.IMAGES.WELCOME_IMAGE;
  const embedColor = config.COLORS.EMBED_COLOR;

  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  const channel = guild.channels.cache.get(WELCOME_CHANNEL);

  const botRolePosition = guild.members.me.roles.highest.position;

  var role = guild.roles.cache.find(role => role.name === JOINING_ROLE);
  const memberRolePosition = role.position;

  if (memberRolePosition >= botRolePosition) {
    const modsChannel = guild.channels.cache.get(MODS_ONLY_CHANNEL);

    modsChannel.send(`Impossible de donner le rôle ${JOINING_ROLE} à ${member} car le rôle ${JOINING_ROLE} est hiérarchiquement supérieur au mien.`)
  } else {
    member.roles.add(role);
  }

  var memberCount = guild.memberCount;

  const welcomeMessage = config.MESSAGES.WELCOME_MESSAGE
    .replace('${member}', member)
    .replace('${memberCount}', memberCount);

  const welcomeEmbed = new EmbedBuilder()
    .setColor(embedColor)
    .setAuthor({
      name: `${client.user.username}`,
      iconURL: getClientAvatar(client),
    })
    .setDescription(welcomeMessage)
    .setImage(welcomeImage)

  channel.send({
    embeds: [welcomeEmbed]
  });
};