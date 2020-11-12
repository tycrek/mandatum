const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');

class CroleCommand extends Command {
	execute(msg) {
		let { args } = this.parseArgs(msg);

		// Sort the args by quotes
		args = args.join(' ').split(/" "+/);

		// Remove quote on the first argument
		args[0] = args[0].substring(1);

		// Remove quote on the last argument
		let lastArg = args[args.length - 1];
		args[args.length - 1] = lastArg.substring(0, lastArg.length - 1);

		// Create the role!
		return msg.guild.roles.create(
			{
				data: {
					name: args[0],
					color: args[1],
					permissions: args[2] === 'NONE' ? 0 : /\d/g.test(args[2]) ? parseInt(args[2]) : args[2],
					mentionable: args[3] == 'true'
				}
			})
			.then((role) => msg.channel.send(`Role [${role.toString()}] created`))
			.then((botMsg) => this.trash(msg, botMsg));
	}
}

module.exports = CroleCommand;
