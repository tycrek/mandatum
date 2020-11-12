const Command = require('../../Command');
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');

class commandname extends Command {
	execute(msg) {
		const { args } = this.parseArgs(msg);

		let category = args.join('-');
		let age = msg.guild.createdTimestamp;
		let everyone = msg.guild.roles.everyone.id;
		let configPath = path.join(__dirname, `../../config/servers/guild.${msg.guild.id}.json`);

		let memberCount = bots = 0;
		return msg.guild.members.fetch()
			.then((members) => members.each((member) => member.user.bot ? bots++ : memberCount++))
			.then(() => msg.guild.channels.create(category, { type: 'category' }))
			.then((c) => c.setPosition(0))
			.then((c) => Promise.all([
				fs.readJson(configPath),
				c.id,
				c.guild.channels.create(`Members: ${memberCount}`, { type: 'voice', parent: c.id, permissionOverwrites: [{ id: everyone, deny: 1048576 }, { id: require('../../bot').client.user.id, allow: 1048592 }] }),
				c.guild.channels.create(`Bots: ${bots}`, { type: 'voice', parent: c.id, permissionOverwrites: [{ id: everyone, deny: 1048576 }, { id: require('../../bot').client.user.id, allow: 1048592 }] }),
				c.guild.channels.create(`Created: ${moment(age).format('MMM Do YYYY')}`, { type: 'voice', parent: c.id, permissionOverwrites: [{ id: everyone, deny: 1048576 }, { id: require('../../bot').client.user.id, allow: 1048592 }] }),
			]))
			.then((results) => {
				let config = results[0];
				config.stats = {
					parent: results[1],
					members: results[2].id,
					bots: results[3].id,
					age: results[4].id
				};
				return config;
			})
			.then((config) => fs.writeJson(configPath, config, { spaces: '\t' }))
			.then(() => msg.channel.send('Stats channels created successfully.'))
			.then((botMsg) => this.trash(msg, botMsg))
	}
}

module.exports = commandname;
