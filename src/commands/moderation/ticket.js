const {
  EmbedBuilder,
  PermissionFlagsBits,
  ButtonBuilder,
  Client,
  ActionRowBuilder,
  ButtonStyle,
  Interaction,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");
const path = require("path");
const { getClientAvatar, readConfig } = require(path.join(
  __dirname,
  "..",
  "..",
  "utils",
  "functions.js"
));

const config = readConfig(process.env.ENVIRONMENT);

const commandName = config.COMMANDS.ticket.name;
const commandDesc = config.COMMANDS.ticket.description;

module.exports = {
  deleted: false,
  name: commandName,
  description: commandDesc,
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.Administrator],

  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    //const channel = interaction.guild.channels.cache.get(interaction.channelId);

    const embedColor = config.COLORS.EMBED_COLOR;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${client.user.username}`,
        iconURL: getClientAvatar(client),
      })

      .setTitle("Ticket!")
      .setDescription("Veuillez séléctionner la raison de votre ticket.")
      .setColor(embedColor);

    const select = new StringSelectMenuBuilder()
      .setCustomId("ticketSelect")
      .setPlaceholder("Pour quelle raison ouvrez vous un ticket?")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("Question")
          .setEmoji("❓")
          .setValue("❓:Question"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Report")
          .setEmoji("🚩")
          .setValue("🚩:Report"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Contestation sanction")
          .setEmoji("👊")
          .setValue("👊:Contestation sanction"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Partenariat")
          .setEmoji("🤝")
          .setValue("🤝:Partenariat"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Candidature")
          .setEmoji("📝")
          .setValue("📝:Candidature"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Problème boutique")
          .setEmoji("💎")
          .setValue("💎:Problème boutique"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Problème en jeu")
          .setEmoji("🚨")
          .setDescription("Duplication, cheat ou autre.")
          .setValue("🚨:Problème en jeu"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Autre")
          .setEmoji("🫙")
          .setValue("🫙:Autre")
      );

    const Buttons = new ActionRowBuilder().addComponents(select);

    interaction.reply({
      embeds: [embed],
      components: [Buttons],
    });
  },
};
