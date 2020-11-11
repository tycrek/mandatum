const Command = require('../../Command');

class SetConfigCommand extends Command {
	execute(msg) {
		const { args } = this.parseArgs(msg);
		return msg.reply(this.setConfig(msg, ...args))
			.then((botMsg) => this.trash(msg, botMsg));
	}
}

module.exports = SetConfigCommand;
