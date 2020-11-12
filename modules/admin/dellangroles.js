const Command = require('../../Command');

class DelLangRolesCommand extends Command {
	execute(msg) {
		let config = this.getConfig(msg.guild.id).settings.langroles.langroles;
		return Promise.all(Object.keys(config).map((roleData) => msg.guild.roles.fetch(config[roleData])))
			.then((roles) => Promise.all(roles.map((role) => role.delete())))
			.then(() => this.setConfig(msg, 'settings', 'langroles', '-'))
			.then(() => msg.channel.send('Deleted language roles'))
			.then((botMsg) => this.trash(msg, botMsg));
	}
}

module.exports = DelLangRolesCommand;
