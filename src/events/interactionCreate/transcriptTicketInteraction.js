require("dotenv").config();
const {
    ActionRowBuilder,
    ButtonBuilder,
    PermissionFlagsBits,
    ButtonStyle,
    Colors,
    EmbedBuilder
} = require("discord.js")

function removeEmojis(text) {
    const emojiPattern = /[\u2705\u274C]/g;

    const textWithoutEmojis = text.replace(emojiPattern, '');

    return textWithoutEmojis.trim();
}

module.exports = async (client, interaction) => {
    if (!interaction.isButton()) {
        return
    }

    if (interaction.customId == "transcriptTicketBtn") {
        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        const channel = guild.channels.cache.get(interaction.channelId);

        if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            try {
                channel.permissionOverwrites.set([{
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        deny: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                        ],
                    },
                ])

                channelName = removeEmojis(channel.name)

                if (channel.name.includes("📜")) {
                    return;
                }

                channel.setName(`📜${channelName}`)

                const embedTranscript = new EmbedBuilder()
                    .setColor(Colors.Gold)
                    .setDescription(`📜 Ticket sauvegardé par ${interaction.user}`)

                interaction.reply({content: "Ticket sauvegardé avec succès.", ephemeral: true})

                channel.send({embeds: [embedTranscript]})
            } catch (error) {
                console.log(error)
            }
        }
    }
}