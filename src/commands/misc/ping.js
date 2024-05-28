module.exports = {
  name: "ping",
  description: "Pong!",
  testOnly: true,
  deleted: true,

  callback: (client, interaction) => {
    interaction.reply(`Pong! ${client.ws.ping}ms`);
  },
};
