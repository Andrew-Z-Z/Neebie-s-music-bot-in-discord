module.exports = {
  name: "resume",
  description: "Resume the paused music queue",
  execute(message) {
    const serverQueue = message.client.queue.get(message.guild.id);
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel || voiceChannel.name !== "Bot-Music") return message.channel.send("You have to be in Bot-Music channel to pause!");
    if (!serverQueue) return;
    const dispatcher = serverQueue.connection.dispatcher;
    if (!dispatcher.paused) return;
    dispatcher.resume();
  }
}
