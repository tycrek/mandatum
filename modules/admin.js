const CATEGORY = 'admin';

/* Imports */
const { MessageEmbed } = require('discord.js');
const fs = require('fs-extra');
const path = require('path');
const { log, trash, filter, noPermission, Command } = require('../utils');
const { prefix, owner } = require('../bot');
const UsageEmbed = require('../UsageEmbed');

// export command functions
module.exports = {

	getconfig: new Command(CATEGORY, null, (cmd, msg) => {
		const args = msg.content.slice(prefix.length).trim().split(/ +/);
		args.shift();

		cmd.getConfig(msg, args)
			.then((result) => msg.channel.send(`\`\`\`json\n${JSON.stringify(result, null, 2)}\`\`\``))
			.then((botMsg) => trash(msg, botMsg));
	}),

	setconfig: new Command(CATEGORY, null, (cmd, msg) => {
		const args = msg.content.slice(prefix.length).trim().split(/ +/);
		args.shift();

		cmd.setConfig(msg, args)
			.then((result) => msg.channel.send(result))
			.then((botMsg) => trash(msg, botMsg));
	}),

	release: new Command(CATEGORY, null, (cmd, msg) => {
		if (!filter.author(msg, owner)) return noPermission(msg);
		const args = msg.content.slice(prefix.length).trim().split(/ +/);
		let project = args[1];
		let version = args[2];
		let change = args[3];
		let fix = args[4];

		let changeText = change.split('##').join('\n- ');
		let fixText = fix.split('##').join('\n- ');

		let embed = new MessageEmbed()
			.setColor(0x03A9F4)
			.setThumbnail('https://raw.githubusercontent.com/tycrek/jmoore.dev/master/client/images/profile/profile-normal-small.jpg')
			.setTitle(`${project} v${version}`)
			.addFields(
				{ name: 'Changes', value: changeText, inline: true },
				{ name: '\u200B', value: '\u200B', inline: true },
				{ name: 'Fixed', value: fixText, inline: true },
			);

		msg.channel.send(embed)
			.catch((err) => log.warn(err));
	}),

	send: new Command(CATEGORY, new UsageEmbed('send', '', false, ['count'], ['How many messages to send']), (cmd, msg) => {
		const args = msg.content.slice(prefix.length).trim().split(/ +/);
		let count = parseInt(args[1]);

		if (!count || count < 1)
			return cmd.help(msg);

		log.info(`Sending ${count} messages to channel ${msg.channel.name} in ${msg.guild.name}`);
		msg.delete().catch((err) => log.warn(err));

		// Generate our message objects and populate the array
		let messages = [];
		for (let i = 0; i < count; i++)
			messages.push(() =>
				new Promise((resolve) =>

					// Send the message
					msg.channel.send(`**Automessage in progress...** (${i + 1}/${count})`)

						// Recursively call the next message event after sending
						.then(() => messages[i + 1]())

						// Previous line will eventually return itself as a promise
						.then(() => resolve())

						// The last message has an error at [i + 1] so we can exploit this as our exit condition
						.catch(() => resolve())));

		// Call the first message in the batch to kick off the loop
		messages[0]()
			.then(() => log.info(`Completed sending ${count} messages to channel ${msg.channel.name} in ${msg.guild.name}`))
			.then(() => msg.member.createDM())
			.then((channel) => channel.send(`**${count}** messages created!`))
			.catch((err) => log.warn(err));
	}),

	stats: new Command(CATEGORY, null, (cmd, msg) => {
		const args = msg.content.slice(prefix.length).trim().split(/ +/);
		let command = args.shift();
		let category = args.join('-');

		let age = msg.guild.createdTimestamp;
		let everyone = msg.guild.roles.everyone.id;
		let configPath = path.join(__dirname, `../config/servers/guild.${msg.guild.id}.json`);

		let members = bots = 0;

		msg.guild.members.cache.each((member) => member.user.bot ? bots++ : members++);

		msg.guild.channels.create(category, { type: 'category' })
			.then((c) => c.setPosition(0))
			.then((c) => Promise.all([
				fs.readJson(configPath),
				c.id,
				c.guild.channels.create(`Members: ${members}`, { type: 'voice', parent: c.id, permissionOverwrites: [{ id: everyone, deny: 1048576 }, { id: require('../bot').client.user.id, allow: 1048592 }] }),
				c.guild.channels.create(`Bots: ${bots}`, { type: 'voice', parent: c.id, permissionOverwrites: [{ id: everyone, deny: 1048576 }, { id: require('../bot').client.user.id, allow: 1048592 }] })
			]))
			.then((results) => {
				let config = results[0];
				config.stats = {
					parent: results[1],
					members: results[2].id,
					bots: results[3].id
				};
				return config;
			})
			.then((config) => fs.writeJson(configPath, config, { spaces: '\t' }))
			.then(() => msg.channel.send('Stats channels created successfully.'))
			.then((botMsg) => trash(msg, botMsg))
			.catch((err) => log.warn(err));
	}),

	delstats: new Command(CATEGORY, null, (cmd, msg) => {
		let configPath = path.join(__dirname, `../config/servers/guild.${msg.guild.id}.json`);

		let config;
		fs.readJson(configPath)
			.then((mConfig) => config = mConfig)
			.then(() => { if (!config.stats) throw Error('No stats data in config') })
			.then(() => msg.guild.channels)
			.then((channels) => Promise.all([channels.resolve(config.stats.parent), channels.resolve(config.stats.members), channels.resolve(config.stats.bots)]))
			.then((stats) => Promise.all(stats.map((statChannel) => statChannel.delete())))
			.then((_results) => msg.channel.send('Deleted stats channels'))
			.then((botMsg) => trash(msg, botMsg))
			.catch((err) => log.warn(err));
	})
}
