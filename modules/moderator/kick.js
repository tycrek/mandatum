const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');

class KickCommand extends Command {
	execute(msg) {
		const { args } = this.parseArgs(msg);

		args.shift(); // Remove the user
		let reason = args.join(' ');

		let nick = msg.mentions.members.first().user.username;

		// Kick the user
		return msg.mentions.members.first().kick(reason)
			.then(() => msg.reply(`Kicked **${nick}** for: *${reason}*`))
			.then((botMsg) => this.trash(msg, botMsg));
	}
}

module.exports = KickCommand;
