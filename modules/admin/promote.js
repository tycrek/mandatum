const Command = require('../../Command');

class PromoteCommand extends Command {
	execute(msg) {
		let { args } = this.parseArgs(msg);
		this.setConfig(msg, 'promote', args[0]);
		return msg.reply(`Promoted ID \`${args[0]}\``)
			.then((botMsg) => this.trash(msg, botMsg));
	}
}

module.exports = PromoteCommand;
