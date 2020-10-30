const Command = require('../../Command');

class NeoSetConfig extends Command {
	execute(msg) {
		const { args } = this.parseArgs(msg);

		let result = this.setConfig(msg, ...args);
		msg.reply(result);
	}
}

module.exports = NeoSetConfig;
