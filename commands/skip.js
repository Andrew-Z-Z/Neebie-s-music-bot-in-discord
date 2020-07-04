
module.exports = {
  name: "skip",
  description: "Skip to next music in Queue",
  execute(message) {
    const serverQueue = message.client.queue.get(message.guild.id);
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel || voiceChannel.name !== "Bot-Music") return message.channel.send("You have to be in Bot-Music channel to skip the song!");
    if (!serverQueue) return;
    serverQueue.connection.dispatcher.end();
  },
}
