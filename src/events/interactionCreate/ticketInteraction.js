const {
  ChannelType,
  PermissionsBitField,
  EmbedBuilder,
  Colors
} = require("discord.js");

module.exports = async (client, interaction) => {
  const user = interaction.user;

  if (interaction.isStringSelectMenu() && interaction.customId == "ticketSelect") {
    const choice = interaction.values[0];
    const emoji = choice.split(":")[0]

    const channel = await interaction.guild.channels.create({
      name: `${emoji}-✅-ticket-${user.username}`,
      type: ChannelType.GuildText,
      topic: `Ticket user: ${user.username}`,
      parent: '1229891383083536437',
      permissionOverwrites: [{
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
          ],
        },
      ],
    });

    interaction.reply({
      ephemeral: true,
      content: `Ticket créé: ${channel}`
    })

    const embedOpen = new EmbedBuilder()
      .setColor(Colors.Green)
      .setDescription(`✅ Ticket ouvert par ${interaction.user}`)

    const embedReason = new EmbedBuilder()
    .setColor(Colors.Red)
    .setDescription(`❓Raison: ${choice}`)

    channel.send({embeds: [embedOpen, embedReason]})
  }
};