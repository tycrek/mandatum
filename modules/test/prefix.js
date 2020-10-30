const Command = require('../../Command');

class PrefixCommand extends Command {
	execute(msg) {
		let { args } = this.parseArgs(msg);
		let newPrefix = args[0] || '>';
		this.setConfig(msg, 'prefix', newPrefix)
		msg.reply(`New prefix set to: ${newPrefix}`);
	}
}

module.exports = PrefixCommand;
