const Command = require('../../Command');

class PrefixCommand extends Command {
	execute(msg) {
		let { args } = this.parseArgs(msg);
		let newPrefix = args[0] || '>';
		this.setConfig(msg, 'prefix', newPrefix);
		return msg.reply(`New prefix set to \`${newPrefix}\``)
			.then((botMsg) => this.trash(msg, botMsg));
	}
}

module.exports = PrefixCommand;
