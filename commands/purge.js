module.exports = {
  name: "purge",
  description: "purge chat messages with given numbers",
  execute(message, args) {
    const amount = parseInt(args[0]) + 1;

    if (isNaN(amount)) message.reply(`You must provide a valid number.`);
    if (amount <= 1 || amount > 100) message.reply(`You need to input a integer between 1 and 99.`);

    message.channel.bulkDelete(amount, true)
    .then(() => {
      message.channel.send(`Purge ${amount} messages successfully!`)
    })
    .catch(error => {
      console.error(error);
      message.channel.send(`Something went wrong when trying to purge in current channel`);
    })
  }
}
