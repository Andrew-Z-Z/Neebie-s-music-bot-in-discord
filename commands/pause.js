module.exports = {
  name: "pause",
  description: "Pause Current Music and Queue",
  execute(message) {
    const serverQueue = message.client.queue.get(message.guild.id);
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel || voiceChannel.name !== "Bot-Music") return message.channel.send("You have to be in Bot-Music channel to pause!");
    if (!serverQueue) return;
    serverQueue.connection.dispatcher.pause();
    message.channel.send(`Queue is paused :: Current Song:${serverQueue.songs[0].title}`)
  },
}
