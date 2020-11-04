const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');

class SchlongCommand extends Command {
	execute(msg) {
		const { args } = this.parseArgs(msg);

		let max = this.getVariable('max', msg.guild.id);
		schlong = '8'.padEnd(Math.min(max, args[0]), '=') + 'D';

		return msg.channel.send(schlong)
			.then((botMsg) => this.trash(msg, botMsg))
	}
}

module.exports = SchlongCommand;
