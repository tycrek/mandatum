const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');

class RoleCommand extends Command {
	execute(msg) {
		const { args } = this.parseArgs(msg);

		if (args.length > 10)
			return msg.reply('only do 10 roles at a time.').then((botMsg) => this.trash(msg, botMsg));

		let roles = this.getConfig(msg.guild.id).settings.langroles.langroles;
		let rolesToAdd = [], rolesToRemove = [];

		args.forEach((arg) => {
			let roleId = roles[Object.keys(roles).find((role) => role.toLowerCase() === arg.replace('-', '').toLowerCase())];
			roleId && (arg.startsWith('-') ? rolesToRemove : rolesToAdd).push(roleId);
		});

		return Promise.all([msg.member.roles.add(roles['⸻ LANGUAGES ⸻'])].concat(rolesToAdd.map((roleId) => msg.member.roles.add(roleId)), rolesToRemove.map((roleId) => msg.member.roles.remove(roleId))))
			.then((_results) => msg.channel.send(
				(rolesToAdd.length > 0 ? ('Roles added: ' + rolesToAdd.map((roleId) => `<@&${roleId}>`).join(', ')) : 'No roles added.') + '\n' +
				(rolesToRemove.length > 0 ? ('Roles removed: ' + rolesToRemove.map((roleId) => `<@&${roleId}>`).join(', ')) : 'No roles removed.')
			))
			.then((botMsg) => this.trash(msg, botMsg));
	}
}

module.exports = RoleCommand;
