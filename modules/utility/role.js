const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');

class RoleCommand extends Command {
	execute(msg) {
		const { args } = this.parseArgs(msg);

		let roles = this.getConfig(msg.guild.id).settings.langroles.langroles;
		return Promise.all([msg.member.roles.add(roles['⸻ LANGUAGES ⸻'])].concat(args.map((arg) =>
			Object.keys(roles).includes(arg.replace('-', '')) && !arg.includes('LANGUAGES') ? (arg.startsWith('-') ? msg.member.roles.remove(roles[arg.replace('-', '')]) : msg.member.roles.add(roles[arg.replace('-', '')])) : '')))
			.then(() => msg.channel.send('Done!'))
			.then((botMsg) => this.trash(msg, botMsg));
	}
}

module.exports = RoleCommand;
