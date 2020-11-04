const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');

class ShutCommand extends Command {
	execute(msg) {
		return msg.channel.send(
			new MessageEmbed()
				.setColor(0x0B1308)
				.setImage('https://shutplea.se/'))
			.then((botMsg) => Promise.all([this.trash(msg, botMsg, false), msg.delete()]));
	}
}

module.exports = ShutCommand;
