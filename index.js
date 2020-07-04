const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config');
const ytdl = require('ytdl-core');

const client = new Discord.Client();
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
console.log(client.commands);

client.on('ready', () => {
  console.log(`Bot ${client.user.tag} is ready!`)
});

client.on('message', async msg => {
  const args = msg.content.substring(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);
  console.log(args);

  if (msg.author.bot || !msg.content.startsWith(prefix)) return;
  if (msg.channel.name !== "bot-order") {
    msg.channel.send('You Can\'t Command the Bot in this Channel!')
    return;
  }

})


// async function executeMusic(msg, serverQueue) {
//   let args = msg.content.substring(prefix.length).split(" ");
//   const voiceChannel = msg.member.voice.channel;

//   if (!voiceChannel || voiceChannel.name !== 'Bot-Music') {
//     msg.channel.send("You must be in \'Bot-Music\' Channel to listen to music")
//   }
//   if (!args[1]) {
//     msg.channel.send("Please Provide a Valid Youtube VideoLink")
//   }

//   const songInfo = await ytdl.getInfo(args[1]);
//   const song = {
//     title: songInfo.title,
//     url: songInfo.video_url
//   };

//   if (!serverQueue) {
//     const queueStructure = {
//       textChannel: msg.channel,
//       voiceChannel: voiceChannel,
//       connection: null,
//       songs: [],
//       volume: 5,
//       playing: true
//     }

//     queue.set(msg.guild.id, queueStructure);
//     queueStructure.songs.push(song);

//     try {
//       let connection = await voiceChannel.join();
//       queueStructure.connection = connection;
//       playMusic(msg.guild.id, queueStructure.songs[0]);
//     } catch (err) {
//       console.error(err);
//       queue.delete(msg.guild.id);
//       return msg.channel.send(err);
//     }
//   } else {
//     serverQueue.songs.push(song);
//     return msg.channel.send(`${song.title} has been added to the queue!`);
//   }
// }

// function playMusic(guild, song) {
//   const serverQueue = queue.get(guild);
//   if (!song) {
//     serverQueue.voiceChannel.leave();
//     queue.delete(guild.id);
//     return;
//   }

//   const dispatcher = serverQueue.connection
//   .play(ytdl(song.url, {filter: "audioonly", /* highWaterMark: 1024 * 1024 * 24 */}))
//   .on("finish", () => {
//     serverQueue.songs.shift();
//     playMusic(guild, serverQueue.songs[0])
//   })
//   .on("error", err => { console.error(error) });
//   dispatcher.setVolumeLogarithmic(serverQueue.volume / 5)
//   serverQueue.textChannel.send(`Start playing ${song.title}`)
// }

client.login(token);
