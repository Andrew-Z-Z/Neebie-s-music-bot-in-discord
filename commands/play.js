const ytdl = require('ytdl-core-discord');
const { getInfo } = require('ytdl-getinfo');

module.exports = {
  name: "play",
  description: "Play the Music in the Queue",
  async execute(message, args) {
    if (!args.length) return;
    try {
      const queue = message.client.queue;
      const serverQueue = queue.get(message.guild.id);

      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel || voiceChannel.name !== "Bot-Music") {
        message.reply("You must be in Bot-Music voice Channel to Listen to Music")
        return;
      }

      /*
        I used a module called "ytdl-getInfo" to make ytdl availble to take in a string, search on Youtube, and returns an unknown video
      */
      const song = await getInfo(args.join(" ")).then(info => {
        return {
          title: info.items[0].title,
          url: info.items[0].webpage_url
        }
      });

      if (!serverQueue) {
        const queueStructure = {
          textChannel: message.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          volume: 5,
          playing: true
        };

        queue.set(message.guild.id, queueStructure);

        queueStructure.songs.push(song)

        try {
          let connection = await voiceChannel.join();
          queueStructure.connection = connection;
          this.play(message, queueStructure.songs[0])
        } catch (error) {
          console.error(error);
          queue.delete(message.guild.id);
          return message.channel.send("error");
        }
      } else {
        serverQueue.songs.push(song);
        return message.channel.send(`${song.title} has been added to the Queue!`);
      }
    } catch(error) {
      console.error(error);
      message.channel.send("Outside Error")
    }
  },
  async play(message, song) {
    const queue = message.client.queue;
    const guild = message.guild;
    const serverQueue = queue.get(guild.id);

    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }

    const dispatcher = serverQueue.connection
    .play(await ytdl(song.url), { type: 'opus' })
    .on('finish', () => {
      serverQueue.songs.shift();
      this.play(message, serverQueue.songs[0])
    })
    .on("error", (err) => {
      console.error(err);
    });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing --${song.title}`);
  }
}
