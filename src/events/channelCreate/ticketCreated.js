require("dotenv").config();
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");

module.exports = async (client, interaction) => {
    function getAvatarUrl(avatar, id) {
        const avatarUrl = `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp?size=160`;
        return avatarUrl;
    }

    const channelName = interaction.name;

    if (channelName.includes("ticket")) {
        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        const channel = guild.channels.cache.get(interaction.id);

        embed = new EmbedBuilder()
            .setAuthor({
                name: `${client.user.username}`,
                iconURL: getAvatarUrl(client.user.avatar, client.user.id),
            })

            .setTitle("Ticket")
            .setDescription("Cliquez sur 📜 pour sauvegarder ce ticket.\nCliquez sur ❌ pour fermer ce ticket.")
            .setColor("White");

        const closeButton = new ButtonBuilder()
            .setCustomId("closeTicketBtn")
            .setLabel("Fermer")
            .setEmoji("❌")
            .setStyle(ButtonStyle.Secondary);

        const transcriptButton = new ButtonBuilder()
            .setCustomId("transcriptTicketBtn")
            .setLabel("Sauvegarder")
            .setEmoji("📜")
            .setStyle(ButtonStyle.Primary);

        const Buttons = new ActionRowBuilder().addComponents(transcriptButton, closeButton)

        channel.send({
            embeds: [embed],
            components: [Buttons]
        })
    }
}