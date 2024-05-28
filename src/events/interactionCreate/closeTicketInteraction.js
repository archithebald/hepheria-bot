require("dotenv").config();
const {
    ActionRowBuilder,
    ButtonBuilder,
    PermissionFlagsBits,
    ButtonStyle,
    PermissionsBitField,
    EmbedBuilder,
    Colors
} = require("discord.js")

module.exports = async (client, interaction) => {
    if (!interaction.isButton()) {
        return
    }

    if (interaction.customId == "closeTicketBtn") {
        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        const channel = guild.channels.cache.get(interaction.channelId);

        try {
            if (interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
                channel.delete();
            } else { // Vérification
                const closeButton = new ButtonBuilder()
                    .setCustomId("closeTicketBtnVerification")
                    .setLabel("Fermer")
                    .setEmoji("❌")
                    .setStyle(ButtonStyle.Secondary);

                const buttons = new ActionRowBuilder().addComponents(closeButton);

                interaction.reply({
                    content: "Es-tu sur de vouloir supprimer ce ticket ?",
                    components: [buttons],
                    ephemeral: true
                })
            }
        } catch (error) {
            console.log(error)
        }
    } else if (interaction.customId == "closeTicketBtnVerification") {
        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        const channel = guild.channels.cache.get(interaction.channelId);

        try {
            console.log(channel)
            channel.permissionOverwrites.set([{
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    deny: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages,
                    ],
                },
            ])

            channel.setName(`❌-ticket-${interaction.user.username}`)

            const embed = new EmbedBuilder()
                .setColor(Colors.Yellow)
                .setDescription(`❌ Ticket fermé par ${interaction.user}`)

            channel.send({embeds: [embed]})

        } catch (error) {
            console.log(error)
        }
    }
}