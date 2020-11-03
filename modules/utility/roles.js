const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');

class RolesCommand extends Command {
	execute(msg) {
		let roles = this.getConfig(msg.guild.id).settings.langroles.langroles;
		return msg.channel.send(
			new MessageEmbed()
				.setTitle('Roles')
				.setDescription(Object.keys(roles).map(role => `\`${role}\``).slice(1).join(', ')))
			.then((botMsg) => this.trash(msg, botMsg));
	}
}

module.exports = RolesCommand;
