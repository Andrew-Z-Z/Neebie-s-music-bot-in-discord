module.exports = {
  name: "help",
  description: "display available commands",
  execute(message) {
    const iterator = message.client.commands.keys();
    for (let value of iterator) {
      message.channel.send(value);
    }
  }
}
