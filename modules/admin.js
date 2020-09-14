/* Imports */
const { Client, MessageEmbed } = require('discord.js');
const fs = require('fs-extra');
const path = require('path');
const { log, printTime, filter, noPermission } = require('../utils');
const prefix = require('../bot').prefix;
const owner = require('../bot').owner;
const UsageEmbed = require('../UsageEmbed');

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
					msg.channel.send(`Config for \`${!command ? msg.guild.name : command}\`:\n\`\`\`json\n${JSON.stringify(!command ? config : config.settings[command], null, 2)}\`\`\``);

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
					msg.channel.send(`${operation === '+' ? 'Added' : 'Removed'} role \`${roleId}\` ${operation === '+' ? 'to' : 'from'} command \`${command}\` in ${msg.guild.name}`);
				} else if (setting === 'exclude') {

					// value should be one of "+12345678" (add) or "-12345678" (remove)
					let operation = value.split('').shift(); // Get the operation (either + or -)
					let roleId = value.substring(1); // Get the channel ID

					// Create empty channels array if it doesn't exist
					if (!config.settings[command].excludedChannels) config.settings[command].excludedChannels = [];

					// Add or remove the channel ID based on what operation is used
					operation === '+' ? config.settings[command].excludedChannels.push(roleId) : config.settings[command].excludedChannels.splice(config.settings[command].excludedChannels.indexOf(roleId), 1);

					// Tell the user what happened
					msg.channel.send(`${operation === '+' ? 'Added' : 'Removed'} exclusion for channel \`${roleId}\` ${operation === '+' ? 'to' : 'from'} command \`${command}\` in ${msg.guild.name}`);
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
		if (!filter.author(msg, owner)) return noPermission(msg);
		const args = msg.content.slice(prefix.length).trim().split(/ +/);
		let count = parseInt(args[1]);

		if (!count || count < 1)
			return msg.channel.send(new UsageEmbed('send', '', false, ['count'], ['How many messages to send']));

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

	steal: (msg) => {
		if (!filter.author(msg, owner)) return noPermission(msg);
		const args = msg.content.slice(prefix.length).trim().split(/ +/);
		args.shift(); // Remove command from args

		if (args < 1)
			return msg.channel.send(new UsageEmbed('steal', '', false, [':emoji:'], ['Emoji to steal and add to current server'], ['To steal multiple emoji, separate each with a space', 'Both static and animated emoji can be stolen']));

		// iterate through the added emoji (must be seperated with a space in message)
		for (let arg of args)
			msg.guild.emojis.create(`https://cdn.discordapp.com/emojis/${arg.split(':')[2].replace('>', '')}${arg.startsWith('<a:') ? '.gif?v=1' : '.png?v=1'}`, arg.split(':')[1])
				.then((emoji) => msg.reply(`added ${emoji}`))
				.catch((err) => log.warn(err));
	}
}