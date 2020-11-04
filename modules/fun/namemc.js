const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');

class NameMCCommand extends Command {
	execute(msg) {
		const { args } = this.parseArgs(msg);

		return msg.channel.send(
			new MessageEmbed()
				.setTitle(`${args[0]} on NameMC`)
				.setColor(0x234875)
				.setURL(`https://namemc.com/s?${args[0]}`)
				.setFooter('https://namemc.com'))
			.then((botMsg) => this.trash(msg, botMsg));
	}
}

module.exports = NameMCCommand;
