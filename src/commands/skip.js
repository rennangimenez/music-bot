const playSong = require("./play").playSong;

const execute = (bot, msg, args) => {
    const queue = bot.queues.get(msg.guild.id);
    if (!queue) {
        return msg.reply("nenhuma música tocando no momento.");
    }
    queue.songs.shift();
    bot.queues.set(msg.guild.id, queue);
    playSong(bot, msg, queue.songs[0]);
};

module.exports = {
    name: "skip",
    help: "Pula para a próxima música",
    execute,
};