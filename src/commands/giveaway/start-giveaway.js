const {
  PermissionFlagsBits,
  ApplicationCommandOptionType,
  EmbedBuilder,
  Colors,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const { timeIsUp, readConfig, updateTimestamp } = require(path.join(
  __dirname,
  "..",
  "..",
  "utils",
  "functions.js"
));

const config = readConfig(process.env.ENVIRONMENT);

const commandName = config.COMMANDS.start_giveaway.name;
const commandDesc = config.COMMANDS.start_giveaway.description;

function secondsToTimestamp(seconds) {
  const days = Math.floor(seconds / (3600 * 24)); // 86400 seconds in a day
  const hours = Math.floor((seconds % (3600 * 24)) / 3600); // 3600 seconds in an hour
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${days}J, ${hours}H, ${minutes}M, ${remainingSeconds}S`;
}

function secondsToMilliseconds(seconds) {
  return seconds * 1000;
}

function updateJson(options, messageId) {
  const title = options.get("titre").value;
  const winners = options.get("gagnants")?.value || 1;
  const temps = secondsToMilliseconds(options.get("temps").value);
  const mention = options.get("mention") || "@everyone";
  const unixEpochTime = Date.now();

  const jsonFileName = path.join(
    __dirname,
    "..",
    "..",
    "assets",
    "giveaway.json"
  );

  const data = fs.readFileSync(jsonFileName);
  const jsonData = JSON.parse(data);

  jsonData.giveaways.push({
    title: title,
    winners: winners,
    time: temps,
    mention: mention,
    unixEpochTime: unixEpochTime,
    messageId: messageId,
  });

  fs.writeFileSync(jsonFileName, JSON.stringify(jsonData));

  const newIndex = jsonData.giveaways.length - 1;

  return newIndex;
}

module.exports = {
  name: commandName,
  description: commandDesc,
  testOnly: false,
  options: [
    {
      name: "titre",
      description: "Qu'est-ce que tu vas faire gagner?",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "temps",
      description: "Combien de temps le giveaway va durer (en secondes)",
      required: true,
      type: ApplicationCommandOptionType.Number,
    },
    {
      name: "gagnants",
      description: "Le nombre de gagnants (1 seul par défaut).",
      required: false,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "mention",
      description: "Le rôle mentionné (par défaut @everyone).",
      required: false,
      type: ApplicationCommandOptionType.Role,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.Administrator],

  callback: async (client, interaction) => {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const channel = guild.channels.cache.get(interaction.channelId);

    const defaultValueForWinners = 1;
    const defaultValueForMention = "@everyone";

    const title = interaction.options.get("titre").value;
    var temps = interaction.options.get("temps").value;
    const winners = interaction.options.get("gagnants")
      ? interaction.options.get("gagnants").value
      : defaultValueForWinners;
    const mention = interaction.options.get("mention")
      ? interaction.options.get("mention").role
      : defaultValueForMention;

    const embed = new EmbedBuilder()
      .setColor(config.COLORS.EMBED_COLOR)
      .setTitle(title)
      .setDescription(
        `Réagis avec 🎉 pour participer!\nSe termine dans: **${updateTimestamp(
          temps
        )}**\n`
      )
      .setFooter({
        text: `${winners} Gagnants | giveaway`,
      });

    async function sendMessageAndReact(channel, embed, mention) {
      try {
        const message = await channel.send({
          embeds: [embed],
          content: `${mention}\n \n🎉 **GIVEAWAY** 🎉`,
        });
        await message.react("🎉");
        return message;
      } catch (error) {
        console.error("Failed to send message or react:", error);
        return null;
      }
    }

    const message = await sendMessageAndReact(channel, embed, mention);
    const messageId = message.id;

    interaction.reply({
      content: "Message créé",
      ephemeral: true,
    });

    const index = updateJson(interaction.options, messageId);

    const intervalId = setInterval(() => {
      temps--;

      const newEmbed = new EmbedBuilder()
        .setColor(config.COLORS.EMBED_COLOR)
        .setTitle(title)
        .setDescription(
          `Réagis avec 🎉 pour participer!\nSe termine dans: **${updateTimestamp(
            temps
          )}**\n`
        )
        .setFooter({
          text: `${winners} Gagnants | giveaway`,
        });

      message.edit({
        embeds: [newEmbed],
        content: `${mention}\n \n🎉 **GIVEAWAY** 🎉`,
      });
    }, 1000);

    setTimeout(() => {
      clearInterval(intervalId);
      timeIsUp(index, client, interaction.options, messageId);
    }, temps * 1000);
  },
};
