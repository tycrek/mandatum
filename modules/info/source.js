const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');

class SourceCommand extends Command {
	execute(msg) {
		return msg.channel.send(
			new MessageEmbed()
				.setTitle('Mandatum source code')
				.setColor(0x181A1B)
				.setURL('https://github.com/tycrek/mandatum')
				.setDescription('Check out my source code on GitHub!')
				.setFooter('License: GPL v3.0'))
			.then((botMsg) => this.trash(msg, botMsg));
	}
}

module.exports = SourceCommand;
