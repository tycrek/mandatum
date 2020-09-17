/* Imports */

// path & fs-extra for filesystem operations
const path = require('path');
const fs = require('fs-extra');

// anything time related such as the cooldown
const moment = require('moment-timezone');

// Good logging tool
const log = require('pino')({
	prettyPrint: true,
	timestamp: () => `,"time": ${moment().format('YYYY-MM-DD hh:mm:ss A')} `
});

// export the utils
module.exports = {
	log: log,

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

	trash: (userMsg, botMsg, deleteUser = true) =>
		botMsg.react('🗑️')
			.then(() => botMsg.awaitReactions((reaction, user) => reaction.emoji.name === '🗑️' && user.id === userMsg.author.id, { max: 1 }))
			.then((_collected) => Promise.all([deleteUser && userMsg.delete(), botMsg.delete()]))
			.catch(log.warn)
};

function neoFilter(msg) {
	return new Promise((resolve, reject) => {

		// Extract the command string without the prefix
		const args = msg.content.slice(require('./bot').prefix.length).trim().split(/ +/);
		let cmd = msg.isSwear ? 'swear' : args.shift();

		// Prep ID's for later use
		let guild = msg.guild.id;
		let channel = msg.channel.id;
		let category = msg.channel.parentID;
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
			.then(() => config.settings[cmd] ? config.settings[cmd] : null)

			// Process the filters
			.then((settings) => {

				//! STEP 1
				// Get a list of modules
				let modules = ['info', 'fun', 'utility', 'moderator', 'admin'].map(category => ({
					module: category,
					commands: Object.keys(require('./modules/' + category))
				}));

				// Check admin/moderator commands. These commands MUST have roles assigned
				for (let module in modules) {
					module = modules[module];
					if (
						//* First check: is the current iteration admin or moderator
						(module.module === 'admin' || module.module === 'moderator') &&

						//* Second check: does the current module iteration have the command being run
						module.commands.includes(cmd) &&

						//* Third check: both admins and roles don't exist for this guild/command
						((config.admins.length === 0) && (!settings || !settings.roles || settings.roles.length === 0))
					)
						return resolve(false);
				}

				//! STEP 2: Is user admin
				// Admins as they can run everything
				let isAdmin = false;
				config.admins.length !== 0 && !isAdmin && roles.each((role) => !isAdmin && config.admins.includes(role.id) || config.admins.includes(author) ? isAdmin = true : {});
				if (isAdmin)
					return resolve(true);

				//! STEP 3: Excluded channel/category
				// Check if channel or category is excluded
				if (settings && settings.excludedChannels && (settings.excludedChannels.includes(channel) || settings.excludedChannels.includes(category)))
					return resolve(false);

				//! STEP 4: Check roles
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