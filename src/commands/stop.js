const execute = (bot, msg, args) => {
    const queue = bot.queues.get(msg.guild.id);
    if (!queue) {
        return msg.reply("nenhuma música tocando no momento.");
    }
    queue.songs = [];
    bot.queues.set(msg.guild.id, queue);
    queue.dispatcher.end();
};

module.exports = {
    name: "stop",
    help: "Para toda a reprodução de música do servidor.",
    execute,
}; 