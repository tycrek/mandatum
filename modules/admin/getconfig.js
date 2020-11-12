const Command = require('../../Command');

class GetConfigCommand extends Command {
	execute(msg) {
		const { args } = this.parseArgs(msg);
		let config = this.getConfig(msg.guild.id);

		let result;
		try {
			if (args[0] === 'commands' || args[0] === 'settings')
				result = args.length === 3 ? config[args[0]][args[1]][args[2]] : args.length === 2 ? config[args[0]][args[1]] : config[args[0]];
			else if (args[0]) result = config[args[0]];
			else result = config;
		} catch (err) {
			result = null;
		}

		return msg.channel.send(`\`\`\`json\n${JSON.stringify(result, null, 2)}\`\`\``)
			.then((botMsg) => this.trash(msg, botMsg));
	}
}

module.exports = GetConfigCommand;
