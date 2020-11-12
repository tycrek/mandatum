const Command = require('../../Command');

class GitHubCommand extends Command {
	execute(msg) {
		return msg.channel.send('Visit: https://github.com/tycrek')
			.then((botMsg) => this.trash(msg, botMsg));
	}
}

module.exports = GitHubCommand;
