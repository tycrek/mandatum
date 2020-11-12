const Command = require('../../Command');

class ArgTest extends Command {
	execute(msg) {
		const { args } = this.parseArgs(msg);
		msg.channel.send(args[0].padEnd(Math.min(args[1] || this.getVariable('length', msg.guild.id), this.getVariable('max', msg.guild.id)), args[0]))
	}
}

module.exports = ArgTest;
