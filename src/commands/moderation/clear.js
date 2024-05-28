const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  Client,
  Interaction,
} = require("discord.js");

const { readConfig } = require("../../utils/functions");

const config = readConfig(process.env.ENVIRONMENT);

const commandName = config.COMMANDS.clear.name;
const commandDesc = config.COMMANDS.clear.description;

module.exports = {
  deleted: false,
  name: commandName,
  description: commandDesc,
  options: [
    {
      name: "nombre",
      description: "Nombre de messages à supprimer.",
      required: true,
      type: ApplicationCommandOptionType.Number,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.ManageMessages],

  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const channel = interaction.channel;

    const amount = interaction.options.get("nombre").value;

    if (amount >= 100 || amount < 1) {
      return await interaction.reply({
        content: "Veuillez choisir un nombre **entre** 1 et 100",
        ephemeral: true,
      });
    }

    const messages = await channel.messages.fetch({ limit: amount + 1 });

    await channel.bulkDelete(messages);
    await interaction.reply({
      content: `**${amount} messages** ont été supprimé`,
      ephemeral: true,
    });
  },
};
