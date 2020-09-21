/* Imports */
const { MessageEmbed } = require('discord.js');
const fs = require('fs-extra');
const path = require('path');
const { log, trash, filter, noPermission } = require('../utils');
const { prefix, owner, client } = require('../bot');
const UsageEmbed = require('../UsageEmbed');
const ytdl = require('ytdl-core-discord');

// export command functions
module.exports = {

	config: (msg) => {
		if (!filter.author(msg, owner)) return noPermission(msg);
		const args = msg.content.slice(prefix.length).trim().split(/ +/);
		args.shift();

		let configPath = path.join(__dirname, `../config/servers/guild.${msg.guild.id}.json`);

		let command = args[0]; // Any command the bot runs (crole, btc, release, etc.)
		let setting = args[1]; // The setting/option that will be changed
		let value = args[2]; // Value to apply to the setting

		let config;
		fs.readJson(configPath)
			.then((mConfig) => config = mConfig)

			// Check if settings already exist
			.then(() => config.settings[command] ? config.settings[command] : null)
			.then((settings) => {
				if (!settings && command) config.settings[command] = {};

				// Send current config if no changes specified
				if (!command || !setting)
					msg.channel.send(`Config for \`${!command ? msg.guild.name : command}\`:\n\`\`\`json\n${JSON.stringify(!command ? config : config.settings[command], null, 2)}\`\`\``)
						.then((botMsg) => trash(msg, botMsg));

				// Change command roles property
				if (setting === 'roles') {

					// value should be one of "+12345678" (add) or "-12345678" (remove)
					let operation = value.split('').shift(); // Get the operation (either + or -)
					let roleId = value.substring(1); // Get the role ID

					// Create empty roles array if it doesn't exist
					if (!config.settings[command].roles) config.settings[command].roles = [];

					// Add or remove the role ID based on what operation is used
					operation === '+' ? config.settings[command].roles.push(roleId) : config.settings[command].roles.splice(config.settings[command].roles.indexOf(roleId), 1);

					// Tell the user what happened
					msg.channel.send(`${operation === '+' ? 'Added' : 'Removed'} role \`${roleId}\` ${operation === '+' ? 'to' : 'from'} command \`${command}\` in ${msg.guild.name}`)
						.then((botMsg) => trash(msg, botMsg));
				} else if (setting === 'exclude') {

					// value should be one of "+12345678" (add) or "-12345678" (remove)
					let operation = value.split('').shift(); // Get the operation (either + or -)
					let roleId = value.substring(1); // Get the channel ID

					// Create empty channels array if it doesn't exist
					if (!config.settings[command].excludedChannels) config.settings[command].excludedChannels = [];

					// Add or remove the channel ID based on what operation is used
					operation === '+' ? config.settings[command].excludedChannels.push(roleId) : config.settings[command].excludedChannels.splice(config.settings[command].excludedChannels.indexOf(roleId), 1);

					// Tell the user what happened
					msg.channel.send(`${operation === '+' ? 'Added' : 'Removed'} exclusion for channel \`${roleId}\` ${operation === '+' ? 'to' : 'from'} command \`${command}\` in ${msg.guild.name}`)
						.then((botMsg) => trash(msg, botMsg));
				} else if (setting === 'cooldown') {
					let channel = msg.channel.id;
					if (!config.settings[command].cooldown) config.settings[command].cooldown = {};

					if (value === '-') {
						config.settings[command].cooldown[channel] = undefined;
						config = JSON.parse(JSON.stringify(config));
					} else {
						config.settings[command].cooldown[channel] = value;
					}

					// Tell the user what happened
					msg.channel.send(`${command} cooldown set to \`${value}\` in ${msg.guild.name}`)
						.then((botMsg) => trash(msg, botMsg));
				}

				// Return config to next Promise to write it
				return config;
			})
			.then((config) => fs.writeJson(configPath, config, { spaces: '\t' }))
			.catch((err) => log.warn(err));
	},

	release: (msg) => {
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
	},

	send: (msg) => {
		const args = msg.content.slice(prefix.length).trim().split(/ +/);
		let count = parseInt(args[1]);

		if (!count || count < 1)
			return msg.channel.send(new UsageEmbed('send', '', false, ['count'], ['How many messages to send']))
				.then((botMsg) => trash(msg, botMsg));

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
	},

	stats: (msg) => {
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
	},

	delstats: (msg) => {
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
	},

	voice: (msg) => {
		const args = msg.content.slice(prefix.length).trim().split(/ +/);

		let user = msg.member;

		if (!user.voice.channel)
			return msg.reply('please join a voice channel first!').then((botMsg) => trash(msg, botMsg));

		msg.member.voice.channel.join()
			.then(connection => {
				play(connection, args[1])
			})
			.catch((err) => log.warn(err));
	}
}

async function play(connection, url) {
	connection.play(await ytdl(url, { quality: 'highestaudio' }), { type: 'opus' });
}