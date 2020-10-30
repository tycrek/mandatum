const Command = require('../../Command');

class TestCommand extends Command {
	execute(msg) {
		let { args } = this.parseArgs(msg);
		msg.channel.send(`result: ${args}`)
	}
}

module.exports = TestCommand;
