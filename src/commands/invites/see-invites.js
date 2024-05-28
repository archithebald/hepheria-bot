const {
    PermissionFlagsBits,
    EmbedBuilder,
    Colors
} = require("discord.js");
const { loadCache } = require("../../utils/functions");

module.exports = {
    name: 'invites',
    description: "Suivi des invitations d'un utilisateur.",
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

        const invitesEmbed = new EmbedBuilder()
            .setTitle("Utilisateurs invités")
            .setColor(Colors.Green)
            .setDescription(`**Validé ✅ ${totalUses}\nFake ❌ ${totalFakes}\nQuitté 👋 ${totalLeaves}**`)

        interaction.reply({
            embeds: [invitesEmbed]
        })
    },
};