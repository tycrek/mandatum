/* Imports */

// path & fs-extra for filesystem operations
const path = require('path');
const fs = require('fs-extra');
const UsageEmbed = require('./UsageEmbed');

// anything time related such as the cooldown
const moment = require('moment-timezone');

// Good logging tool
const log = require('pino')({
	prettyPrint: true,
	level: 'debug',
	base: null,
	timestamp: () => `,"time": ${moment().format('YYYY-MM-DD hh:mm:ss A')} `,
	// hooks: {
	// 	logMethod(inputArgs, method) {
	// 		return method.apply(this, inputArgs);
	// 	}
	// }
});

let prefix;

class Command {
	/**
	 * 
	 * @param {string} keyword 
	 * @param {string} category 
	 * @param {UsageEmbed} usage 
	 * @param {function} execute 
	 */
	constructor(category, usage, execute) {
		if (!prefix) prefix = require('./bot').prefix;
		this.category = category;
		this.usage = usage;

		// Somewhat janky promisification
		this.execute = (msg) => new Promise((resolve, reject) => {

			// Log the command use
			const command = msg.content.slice(prefix.length).trim().split(/ +/).shift();
			const server = msg.guild, channel = msg.channel, author = msg.author;
			log.debug(`[COMMAND] >${command} ran in [${server.name}:${channel.name}] [${server.id}:${channel.id}] by @${author.tag}`);

			// If command execution fails, handle it here
			try { resolve(execute(this, msg)) }
			catch (err) { reject(err) }
		}).catch((err) => log.warn(err));
	}

	getConfig(msg, key) {
		let configPath = path.join(__dirname, `./config/servers/guild.${msg.guild.id}.json`);

		return new Promise((resolve, reject) => {
			fs.readJson(configPath)
				.then((config) => {
					try {
						if (key[0] === 'commands' || key[0] === 'settings')
							return key.length === 3 ? config[key[0]][key[1]][key[2]] : key.length === 2 ? config[key[0]][key[1]] : config[key[0]];
						else if (key[0]) return config[key[0]];
						else return config;
					} catch (err) {
						return null;
					}
				})
				.then((value) => resolve(value))
				.catch((err) => reject(err));
		});
	}

	setConfig(msg, key) {
		let message, configPath = path.join(__dirname, `./config/servers/guild.${msg.guild.id}.json`);

		return new Promise((resolve, reject) => {
			fs.readJson(configPath)
				.then((config) => {
					if (key[0] === 'commands' || key[0] === 'settings') {

						// Create empty setting if necessary
						if (!config[key[0]][key[1]]) config[key[0]][key[1]] = {};
						if (!config[key[0]][key[1]][key[2]]) config[key[0]][key[1]][key[2]] = null;

						// Remove the setting or command
						if ((key[3] && key[3] === '-') || key[2] === '-') {
							if (key[3]) config[key[0]][key[1]][key[2]] = undefined;
							else config[key[0]][key[1]] = undefined;
							config = JSON.parse(JSON.stringify(config));
							message = `Removed.`
						} else if (key[2] === 'roles' || key[2] === 'exclude') {

							// The command is exclude but the field is excludedChannels so we end up with a blank exlude category. This removes it
							if (key[2] === 'exclude') {
								key[2] = 'excludedChannels';
								config[key[0]][key[1]].exclude = undefined;
								config = JSON.parse(JSON.stringify(config));
							}

							// Value should be one of "+12345678" (add) or "-12345678" (remove)
							let operation = key[3].split('').shift(); // Get the operation (either + or -)
							let roleId = key[3].substring(1); // Get the role/channel ID

							// Create empty key if necessary
							if (!config[key[0]][key[1]][key[2]]) config[key[0]][key[1]][key[2]] = [];

							operation === '+' ? config[key[0]][key[1]][key[2]].push(roleId) : config[key[0]][key[1]][key[2]].splice(config[key[0]][key[1]][key[2]].indexOf(roleId), 1);
							message = `${operation === '+' ? 'Added' : 'Removed'} ${key[2] === 'roles' ? 'role' : 'channel exclusion'} \`${roleId}\` ${operation === '+' ? 'to' : 'from'} command \`${key[1]}\``;
						} else if (key[2] === 'cooldown') {
							if (!config[key[0]][key[1]][key[2]]) config[key[0]][key[1]][key[2]] = {};
							config[key[0]][key[1]][key[2]][msg.channel.id] = key[3];
							message = `Set \`${key[1]}: ${key[2]}\` to \`${key[3]}\` for channel ${msg.channel.name}`;
						} else {
							config[key[0]][key[1]][key[2]] = key[3];
							message = `Set \`${key[1]}: ${key[2]}\` to \`${key[3]}\``;
						}
					} else {
						message = 'Not implemented';
					}

					if (!message || message.trim() === '') message = '\`No message set\`';
					return config;
				})
				.then((config) => fs.writeJson(configPath, config, { spaces: '\t' }))
				.then(() => resolve(message))
				.catch((err) => reject(err));
		});
	}

	help(msg) {
		msg.channel.send(this.usage).then((botMsg) => trash(msg, botMsg));
	}
}

// export the utils
module.exports = {
	log,
	Command,

	// Print the time in a nice format: 6:57:30 pm, September 7th, 2020
	printTime: () => moment().format('h:mm:ss a, MMMM Do, YYYY'),

	filter: {
		// Filter message by guild
		// Returns true if message is the guild ID (can also be an array of guild IDs)
		guild: (msg, guildId) => (guildId instanceof Array && guildId.find(id => id === msg.guild.id) && true) || msg.guild.id === guildId,

		// Filter message by category
		// Returns true if message is the category ID (can also be an array of channes IDs)
		category: (msg, categoryId) => (categoryId instanceof Array && categoryId.find(id => id === msg.channel.parent.id) && true) || msg.channel.parent.id === categoryId,

		// Filter message by channel
		// Returns true if message is the channel ID (can also be an array of channel IDs)
		channel: (msg, channelId) => (channelId instanceof Array && channelId.find(id => id === msg.channel.id) && true) || msg.channel.id === channelId,

		// Filter message by channel
		// Returns true if message is the channel ID (can also be an array of channel IDs)
		author: (msg, authorId) => (authorId instanceof Array && authorId.find(id => id === msg.author.id) && true) || msg.author.id === authorId,

		// Filter message by role
		// Returns true if message is the role ID (does NOT support arrays yet)
		role: (msg, roleId) => (!(roleId instanceof Array) && msg.member.roles.cache.some(role => role.id === roleId)),
	},

	// Reads a json file
	readJson: (filepath) => fs.readJsonSync(filepath),

	// Writes a json file
	writeJson: (filepath, json) => fs.writeJsonSync(filepath, json, { spaces: '\t' }),

	// author does not have permission to use command
	noPermission: (msg) => msg.reply('sorry, but you don\'t have permission to do that.')
		.then((botMsg) => trash(msg, botMsg)),

	// New filter system
	neoFilter: neoFilter,

	trash: trash,

	splitArgs: (msg, prefix) => msg.content.slice(prefix.length).trim().split(/ +/),

	removeItemOnce: (arr, value) => {
		let index = arr.indexOf(value)
		if (index > -1) arr.splice(index, 1);
		return arr;
	}
};

function trash(userMsg, botMsg, deleteUser = true) {
	botMsg.react('🗑️')
		.then(() => botMsg.awaitReactions((reaction, user) => reaction.emoji.name === '🗑️' && (userMsg ? user.id === userMsg.author.id : true), { max: 1 }))
		.then((_collected) => Promise.all([deleteUser && userMsg.delete(), botMsg.delete()]))
		.catch((err) => err.message !== 'Unknown Message' && log.warn(err));
}

function neoFilter(msg) {
	return new Promise((resolve, reject) => {

		let guildConfig = fs.readJsonSync(path.join(__dirname, `./config/servers/guild.${msg.guild.id}.json`));
		let pre = guildConfig.prefix || require('./bot').prefix;

		// Extract the command string without the prefix
		const args = msg.content.slice(pre.length).trim().split(/ +/);
		let cmd = args.shift();

		// Prep ID's for later use
		let guild = msg.guild.id;
		let channel = msg.channel.id;
		let author = msg.member.id;
		let roles = msg.member.roles.cache;

		// Owner can always run everything
		let forceTest = false; //* true = dev mode, false = production
		if (require('./bot').owner === author && !forceTest) return resolve(true);

		// Read server config
		let config;
		fs.readJson(path.join(__dirname, `/config/servers/guild.${guild}.json`))
			.then((mConfig) => config = mConfig)

			// Check if a config for this command actually exists
			.then(() => config.commands[cmd] ? config.commands[cmd] : config.settings[cmd] ? config.settings[cmd] : null)

			// Process the filters
			.then((settings) => {
				let commands = require('./modules/commands');
				let category = commands.getCommand(cmd).getCommandData().getCategory();

				//! Step 1: Check if admin-only command is run by admin
				let isAdmin = false;
				config.admins.length !== 0 && !isAdmin && roles.each((role) => !isAdmin && config.admins.includes(role.id) || config.admins.includes(author) ? isAdmin = true : {});
				if ((category === 'admin' || category === 'moderator') && !isAdmin)
					return resolve(false);

				//! Step 2: Check if command is diabled for server
				if (settings && settings.enabled != null && settings.enabled == 'false')
					return resolve([false, false]);

				//! Step 3: Check if channel or category doesn't allow command
				if (settings && settings.excludedChannels && (settings.excludedChannels.includes(channel) || settings.excludedChannels.includes(category)))
					return resolve(false);

				//! Step 4: Check roles
				// If no roles are assigned, assume everyone can run the command
				if (!settings || !settings.roles || settings.roles.length === 0) resolve(true);
				else {
					let match = false;

					// If the user has a role matching the roles permitted to run the command, we have a match
					roles.each((role) => !match && settings.roles.includes(role.id) ? match = true : {});

					// Return to the command processor
					resolve(match);
				}
			})
			.catch((err) => reject(err));
	});
}