/**
 * mandatum
 * 
 * A Discord bot
 * 
 * GNU GPL 3.0
 * 
 * Written by tycrek
 * > jmoore.dev
 * > github.com/tycrek
 * 
 * Recommended software for development: Visual Studio Code
 * Recommended VSCode extensions:
 *   - Babel JavaScript (Michael McDermott)
 *   - Better Comments (Aaron Bond)
 *   - Bracket Pair Colorizer 2 (CoenraadS)
 *   - Path Intellisense (Christian Kohler)
 *   - TabNine (TabNine)
 *   - Todo Tree (Gruntfuggly)
 * Suggested theme (optional):
 *   - Night Owl (sarah.drasner)
 *   - Material Icon Theme (Philipp Kief)
 */

//! Only set to true if running behind a firewall that injects self-signed certificates (dev environments ONLY)
const USING_VPN = false;
if (USING_VPN && process.env.NODE_ENV !== 'production') process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//#region  Imports
// discord.js for Discord API
const { Client } = require('discord.js');

// path & fs-extra for filesystem operations
const path = require('path');
const fs = require('fs-extra');

// My own stuff from utils.js
const { log, readJson, writeJson, neoFilter, noPermission } = require('./utils');
//#endregion

//#region Variables
// Servers where the bot is active //todo: automate this
const guilds = require('./config/guilds');

const { owner, prefix } = require('./config/config');

// Discord client
const client = new Client();

// Bot commands
var commands = require('./modules/commands');
//#endregion

//#region Startup tasks
//* Version check (need node 11 or later)
if (process.version.match(/^v(\d+\.\d+)/)[1].split('.')[0] <= 11) {
	log.fatal(`Must be using Node.js 11 or later! Current version: ${process.version}`);
	return process.exit(1);
}

//* Export everything
//todo: revist; this may not be required
module.exports = {
	client: client,
	owner: owner,
	guilds: guilds,
	prefix: prefix
};
//#endregion

//#region Client events
// When client is ready (after it logs in)
client.once('ready', () => {
	log.info('Beep, boop! mandatum is ready :)');

	// Check configurations
	client.guilds.cache.each((guild) => {
		let configPath = path.join(__dirname, `config/servers/guild.${guild.id}.json`);
		fs.exists(configPath)
			.then((exists) => {
				if (!exists) {
					let template = readJson(path.join(__dirname, 'config/servers/__template.json'));
					template.name = guild.name;
					template.id = guild.id;
					writeJson(configPath, template);
					log.info(`Wrote new config for guild ${guild.name} (${guild.id})`);
				}
				else log.info(`Found config for guild ${guild.name} (${guild.id})`);
			});
	});

	// Update members if needed
	client.guilds.cache.each((guild) => {
		let configPath = path.join(__dirname, `config/servers/guild.${guild.id}.json`);
		fs.exists(configPath)
			.then((exists) => {
				if (!exists) throw Error('');
				else return fs.readJson(configPath);
			})
			.then((config) => {
				if (!config.stats) throw Error(`No stats for guild [${guild.id}], ignoring`);
				else return Promise.all([
					client.guilds.resolve(guild.id).members.fetch(),
					client.guilds.resolve(guild.id).channels.resolve(config.stats.members),
					client.guilds.resolve(guild.id).channels.resolve(config.stats.bots)
				]);
			})
			.then((results) => {
				let members = bots = 0;
				results[0].each((member) => member.user.bot ? bots++ : members++);

				let oldMembersPrefix = results[1].name.split(' ')[0];
				let oldBotsPrefix = results[2].name.split(' ')[0];
				let newMembers = `${oldMembersPrefix} ${members}`;
				let newBots = `${oldBotsPrefix} ${bots}`;

				return Promise.all([results[1].setName(newMembers), results[2].setName(newBots)]);
			})
			.catch((err) => log.warn(err.message));
	});

	// Custom status
	client.user.setActivity(`the world burn`, { type: "WATCHING" })
		.catch((err) => log.warn(err));
});

client.on('warn', (warn) => log.warn(warn));
client.on('error', (error) => log.error(error));
client.on('invalidated', () => log.fatal('Session invalidated, please restart!'));
client.on('rateLimit', (info) => log.warn(`[API] Rate limit hit, ${info.timeout}ms delay!`));

var statsUpdate = (member, op) => {

	let guild = member.guild.id;
	let configPath = path.join(__dirname, `./config/servers/guild.${guild}.json`);
	fs.readJson(configPath)
		.then((config) => {
			if (!config.stats) throw Error(`No stats for guild [${guild}], ignoring`);
			else {
				let channel = member.guild.channels.resolve(config.stats[member.user.bot ? 'bots' : 'members']);

				let prefix = channel.name.split(' ')[0];
				let suffix = parseInt(channel.name.split(' ')[1]);

				let newName = `${prefix} ${op === 0 ? suffix += 1 : suffix -= 1}`;

				return channel.setName(newName);
			}
		})
		.catch((err) => log.warn(err));
};

client.on('guildMemberAdd', (member) => statsUpdate(member, 0));
client.on('guildMemberRemove', (member) => statsUpdate(member, 1));

// Command processor
client.on('message', (msg) => {
	if (msg.channel.type === 'dm' || msg.author.bot) return;

	let guildConfig = readJson(path.join(__dirname, `./config/servers/guild.${msg.guild.id}.json`));
	let pre = guildConfig.prefix || prefix;

	if (!msg.content.startsWith(pre) || msg.content[1] === ' ' || msg.content.length < 2) return;

	// Filter the command using the new filter system
	neoFilter(msg)
		.then((allowed) => {
			if (typeof allowed === typeof [] && !allowed[0] && !allowed[1]) return;
			else if (!allowed) return noPermission(msg);
			commands.getCommand(msg.content.slice(pre.length).trim().split(/ +/)[0]).superExec(msg);
		})
		.catch((err) => log.warn(err));
});
//#endregion

//* Log in to Discord using token
client.login(fs.readJsonSync(path.join(__dirname, 'auth.json')).token)
	.catch((err) => log.warn(err));
