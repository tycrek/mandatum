/* Imports */

// discord.js for Discord API
//const { Client, MessageEmbed } = require('discord.js');

// path & fs-extra for filesystem operations
const path = require('path');
const fs = require('fs-extra');

// for fetching data from the net
//const fetch = require('node-fetch');

// for scheduling automated messages
//const schedule = require('node-schedule');

// for fun :)
//const UUID = require('uuid').v4;

// anything time related such as the cooldown
const moment = require('moment');

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
	noPermission: (msg) => msg.reply('sorry, but you don\'t have permission to do that.'),

	// New filter system
	neoFilter: neoFilter
};

function neoFilter(msg) {
	return new Promise((resolve, reject) => {

		// Extract the command string without the prefix
		const args = msg.content.slice(require('./bot').prefix.length).trim().split(/ +/);
		let cmd = args.shift();

		// Prep ID's for later use
		let guild = msg.guild.id;
		let channel = msg.channel.id;
		let author = msg.member.id;
		let roles = msg.member.roles.cache;

		// Owner can always run everything
		if (require('./bot').owner === author) resolve(true);

		// Read server config
		fs.readJson(path.join(__dirname, `/config/servers/guild.${guild}.json`))

			// Check if a config for this command actually exists
			.then((settings) => settings.settings[cmd] ? settings.settings[cmd] : null)
			.then((settings) => {
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