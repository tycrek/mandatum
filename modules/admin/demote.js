const Command = require('../../Command');

class DemoteCommand extends Command {
	execute(msg) {
		let { args } = this.parseArgs(msg);
		this.setConfig(msg, 'demote', args[0]);
		return msg.reply(`Demoted ID \`${args[0]}\``)
			.then((botMsg) => this.trash(msg, botMsg));
	}
}

module.exports = DemoteCommand;
