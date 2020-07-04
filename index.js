const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config');
const Client = require('./client/Client');

const client = new Client();
client.commands = new Discord.Collection();

/*
  fs.readdir(<file path>) reads the file asynchronously
  fs.readdirsync reads the file synchronously, BLOCKS MAIN THREAD && PREVENTS EXECUTION OF ASYNC CODE

  fs.readdirsync returns an array containing all files(name of file) from target path
*/
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
}

client.queue = new Map();

client.on('ready', () => {
  console.log(`Bot ${client.user.tag} is ready!`)
});

client.on('message', async msg => {
  if (msg.author.bot || !msg.content.startsWith(prefix)) return;
  if (msg.channel.name !== "bot-order") {
    msg.channel.send('You Can\'t Command the Bot in current Channel!')
    return;
  }
  const args = msg.content.substring(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);

  if (!client.commands.has(commandName)) return;

  try {
    command.execute(msg, args);
  } catch(error) {
    console.error(error);
    msg.reply(`There is an unexpected err: ${error}`)
  }
});

client.login(token);
