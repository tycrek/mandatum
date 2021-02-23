const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');

class commandname extends Command {
	execute(msg) {
		let { args } = this.parseArgs(msg);

		let rolePromises = msg.guild.members.cache.map((member) => member.roles.add(args));
		return Promise.all(rolePromises)
			.then((_results) => msg.reply('Completed, hopefully!'))
			.then((botMsg) => this.trash(msg, botMsg))
			.catch((err) => log.warn(err));
	}
}

module.exports = commandname;
