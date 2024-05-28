const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  Client,
  Interaction,
} = require("discord.js");

const path = require("path");
const errorMessages = require(path.join(
  __dirname,
  "..",
  "..",
  "..",
  "error-messages.json"
))["kick"];

const { readConfig } = require("../../utils/functions");

const config = readConfig(process.env.ENVIRONMENT);

const commandName = config.COMMANDS.kick.name;
const commandDesc = config.COMMANDS.kick.description;

module.exports = {
  deleted: false,
  name: commandName,
  description: commandDesc,
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [
    {
      name: "membre",
      description: "The user to ban.",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: "reason",
      description: "The reason for banning.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.KickMembers],
  botPermissions: [PermissionFlagsBits.KickMembers],

  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const targetUserID = interaction.options.get("membre").value;
    const reason = interaction.options.get("reason")?.value || "";

    const targetUser = await interaction.guild.members.fetch(targetUserID);

    if (!targetUser) {
      await interaction.reply(errorMessages["non-existant"]);
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.reply(errorMessages["owner"]);
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position;
    const requestUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.reply(errorMessages["user"]);
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.reply(errorMessages["higherRole"]);
      return;
    }

    try {
      await targetUser.kick({ reason: reason });
      await interaction.reply(`${targetUser.displayName} a bien été exclu.`);
    } catch (error) {
      console.log(`Erreur lors de l'exclusion : ${error}`);
    }
  },
};
