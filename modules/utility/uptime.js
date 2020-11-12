const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');


class UptimeCommand extends Command {
	execute(msg) {
		let totalSeconds = require('../../bot').client.uptime / 1000;
		let hours = (totalSeconds / (60 * 60)).toString().split('.')[0];
		let minutes = (totalSeconds / 60 % 60).toString().split('.')[0];
		let seconds = (totalSeconds % 60).toString().split('.')[0];

		return msg.channel.send(
			new MessageEmbed()
				.setTitle(`Bot has been active for ${hours} hours, ${minutes} minutes, ${seconds} seconds`))
			.then((botMsg) => this.trash(msg, botMsg));
	}
}

module.exports = UptimeCommand;
