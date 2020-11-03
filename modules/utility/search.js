const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');

class commandname extends Command {
	execute(msg) {
		const { args } = this.parseArgs(msg);

		return msg.channel.send(
			new MessageEmbed()
				.setColor(0xE0632F)
				.setAuthor(`Searching "${args.join(' ')}" for ${msg.author.username}`)
				.setDescription(`https://duckduckgo.com/?q=${args.join('+')}`))
			.then((botMsg) => this.trash(msg, botMssg));
	}
}

module.exports = commandname;
