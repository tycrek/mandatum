const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');

class DroleCommand extends Command {
	execute(msg) {
		let roleId, roleName;
		try {
			roleId = msg.mentions.roles.first().id;
			roleName = msg.mentions.roles.first().name;
		} catch (err) {
			return msg.reply('please mention a role to delete it.').then((botMsg) => this.trash(msg, botMsg));
		}

		return msg.guild.roles.fetch(roleId)
			.then((role) => role.delete())
			.then(() => msg.channel.send(`Deleted role ${roleName}`))
			.then((botMsg) => this.trash(msg, botMsg));
	}
}

module.exports = DroleCommand;
