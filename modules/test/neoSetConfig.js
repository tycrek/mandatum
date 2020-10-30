const Command = require('../../Command');

class NeoSetConfig extends Command {
	execute(msg) {
		const args = msg.content.slice('>'.length).trim().split(/ +/);
		let cmd = args.shift();

		let result = this.setConfig(msg, ...args);
		msg.reply(result);
	}
}

module.exports = NeoSetConfig;
