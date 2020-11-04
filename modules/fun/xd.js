const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');

class XdCommand extends Command {
	execute(msg) {
		const { args, command } = this.parseArgs(msg);

		let max = this.getVariable('max', msg.guild.id);
		let doUpper = command === command.toUpperCase();

		let xd = (doUpper ? 'XD' : 'xd').padEnd(Math.min(max, args[0]), doUpper ? 'D' : 'd');
		return msg.channel.send(xd)
			.then((botMsg) => this.trash(msg, botMsg));
	}
}

module.exports = XdCommand;
