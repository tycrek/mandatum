const Command = require('../../Command');

class WebsiteCommand extends Command {
	execute(msg) {
		return msg.channel.send('Visit: https://jmoore.dev/')
			.then((botMsg) => this.trash(msg, botMsg));
	}
}

module.exports = WebsiteCommand;
