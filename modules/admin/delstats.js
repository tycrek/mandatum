const Command = require('../../Command');
const fs = require('fs-extra');
const path = require('path');

class DelStatsCommand extends Command {
	execute(msg) {
		let configPath = path.join(__dirname, `../../config/servers/guild.${msg.guild.id}.json`);
		let config;

		return fs.readJson(configPath)
			.then((mConfig) => config = mConfig)
			.then(() => { if (!config.stats) throw Error('No stats data in config') })
			.then(() => msg.guild.channels)
			.then((channels) => Promise.all([channels.resolve(config.stats.parent), channels.resolve(config.stats.members), channels.resolve(config.stats.bots), channels.resolve(config.stats.age)]))
			.then((stats) => Promise.all(stats.map((statChannel) => statChannel.delete())))
			.then((_results) => msg.channel.send('Deleted stats channels'))//todo: update config file
			.then((botMsg) => this.trash(msg, botMsg));
	}
}

module.exports = DelStatsCommand;
