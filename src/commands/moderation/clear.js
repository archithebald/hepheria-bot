const {
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    Client,
    Interaction,
} = require("discord.js");

module.exports = {
    deleted: false,
    name: "clear",
    description: "Supprimer des messages.",
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [{
        name: "nombre",
        description: "Nombre de messages à supprimer.",
        required: true,
        type: ApplicationCommandOptionType.Number,
    }],
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
                ephemeral: true
            });
        }

        const messages = await channel.messages.fetch({limit: amount + 1})

        await channel.bulkDelete(messages);
        await interaction.reply({content: `**${amount} messages** ont été supprimé`, ephemeral: true})
    },
};