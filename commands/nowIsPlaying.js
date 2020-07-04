module.exports = {
  name: "now",
  description: "Display current playing music",
  execute(message) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) {
      message.reply(`There is no Queue!`)
      return;
    }
    message.reply(serverQueue.songs[0].title);
  }
}
