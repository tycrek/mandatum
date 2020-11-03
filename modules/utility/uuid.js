const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');
const UUID = require('uuid').v4;

class UuidCommand extends Command {
	execute(msg) {
		return msg.channel.send(
			new MessageEmbed()
				.setTitle('Here\'s your UUID:')
				.setColor(0x000000)
				.setDescription(`\`${UUID()}\``))
			.then((botMsg) => this.trash(msg, botMsg));
	}
}

module.exports = UuidCommand;
