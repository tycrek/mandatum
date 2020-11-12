const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');

class LinkCommand extends Command {
	execute(msg) {
		const { args } = this.parseArgs(msg);

		return msg.channel.send(
			new MessageEmbed()
				.setTitle(args[0])
				.setColor(0x455A64)
				.setURL(`https://${args[0].toLowerCase()}`))
			.then((botMsg) => Promise.all([this.trash(msg, botMsg, false), msg.delete()]));
	}
}

module.exports = LinkCommand;
