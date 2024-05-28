const { PermissionFlagsBits, EmbedBuilder, Colors } = require("discord.js");
const { loadCache, readConfig } = require("../../utils/functions");

const config = readConfig(process.env.ENVIRONMENT);

const commandName = config.COMMANDS.invite.name;
const commandDesc = config.COMMANDS.invite.description;
const inviteCommandMessage = config.MESSAGES.INVITE_COMMAND_MESSAGE;

module.exports = {
  name: commandName,
  description: commandDesc,
  testOnly: false,
  permissionsRequired: [PermissionFlagsBits.SendMessages],
  botPermissions: [PermissionFlagsBits.SendMessages],

  callback: async (client, interaction) => {
    const cache = loadCache();

    const invites = await cache.invites;

    let totalUses = 0;
    let totalLeaves = 0;
    let totalFakes = 0;

    for (const inviteCode in invites) {
      if (invites.hasOwnProperty(inviteCode)) {
        const invite = invites[inviteCode];
        if (invite.invite.inviterId === interaction.user.id) {
          totalUses += invite.uses;
          totalLeaves += invite.leave;
          totalFakes += invite.fake;
        }
      }
    }

    const finalMessage = inviteCommandMessage.replace(
      /\${(totalUses|totalFakes|totalLeaves)}/g,
      (match, p1) => {
        switch (p1) {
          case "totalUses":
            return totalUses;
          case "totalFakes":
            return totalFakes;
          case "totalLeaves":
            return totalLeaves;
          default:
            return match;
        }
      }
    );

    const invitesEmbed = new EmbedBuilder()
      .setTitle("Utilisateurs invités")
      .setColor(Colors.Green)
      .setDescription(finalMessage);

    interaction.reply({
      embeds: [invitesEmbed],
    });
  },
};
