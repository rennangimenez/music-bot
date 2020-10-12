const search = require("yt-search");
const ytdl = require("ytdl-core-discord");

const execute = (bot, msg, args) => {
    const s = args.join(" ");
    try {
        search(s, (err, result) => {
            if (err) {
                throw err;
            } else if (result && result.videos.length > 0) {
                const song = result.videos[0];
                const queue = bot.queues.get(msg.guild.id);
                if (queue) {
                    queue.songs.push(song);
                    bot.queues.set(msg.guild.id, queue);
                } else playSong(bot, msg, song);
            } else {
                return msg.reply("desculpe, não encontrei sua música!");
            }
        });
    } catch (e) {
        console.error(e);
    }
};

const playSong = async (bot, msg, song) => {
    let queue = bot.queues.get(msg.member.guild.id);
    if (msg.channel.id === "764182232302092288") {
        if (!msg.member.voice.channel) {
            return msg.reply("você precisa estar em um canal de voz para poder ouvir músicas.")
        }
        if (msg.member.voice.channel.id === "764181809369317396") {
            if (!song) {
                if (queue) {
                    queue.connection.disconnect();
                    return bot.queues.delete(msg.member.guild.id);
                }
            }
            if (!queue) {
                const conn = await msg.member.voice.channel.join();
                queue = {
                    volume: 10,
                    connection: conn,
                    dispatcher: null,
                    songs: [song],
                };
            }
            queue.dispatcher = await queue.connection.play(
                await ytdl(song.url, { highWaterMark: 1 << 25, filter: "audioonly" }),
                {
                    type: "opus",
                }
            );
            queue.dispatcher.on("finish", () => {
                queue.songs.shift();
                playSong(bot, msg, queue.songs[0]);
            });
            bot.queues.set(msg.member.guild.id, queue);
        } else {
            return msg.reply("só é possível ouvir músicas no canal: 「🎤」Karaôke.")
        }
    } else {
        return msg.reply("você só pode pedir músicas no canal: <#764182232302092288>.")
    }
};

module.exports = {
    name: "play",
    help: "Reproduz a música desejada no canal atual do usuário",
    execute,
    playSong,
};