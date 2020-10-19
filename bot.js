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
 */

const USING_VPN = true;
if (USING_VPN) process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

/* Imports */

// discord.js for Discord API
const { Client, MessageEmbed } = require('discord.js');

// path & fs-extra for filesystem operations
const path = require('path');
const fs = require('fs-extra');

// for scheduling automated messages
const schedule = require('node-schedule');

// anything time related such as the cooldown
const moment = require('moment-timezone');

const { log, printTime, filter, readJson, writeJson, neoFilter, noPermission, trash } = require('./utils');

/* Variables */

// servers where the bot is active
const guilds = require('./config/guilds');

// bot owner, has access to everything
const owner = require('./config/config').owner;

// Cooldown timer for last swear in channel //! currently behaves globally (swear in 1 server affects cooldown in another server)
let lastSwear = {};

// Prefix for bot commands
const prefix = require('./config/config').prefix;

// client
const client = new Client();

//* (1/3) Export everything
module.exports = {
	client: client,
	owner: owner,
	guilds: guilds,
	prefix: prefix
};

//* (2/3) Set up commands
var commands = {
	...require('./modules/info'),
	...require('./modules/fun'),
	...require('./modules/utility'),
	...require('./modules/voice'),
	...require('./modules/moderator'),
	...require('./modules/admin')
};

//* (3/3) Add commands to exports
module.exports.commands = commands;

/* client events */

// When client is ready (after it logs in)
client.once('ready', () => {
	log.info('Beep, boop! mandatum is ready :)');

	//client.guilds.fetch(guilds.bt)
	//	.then((guild) => guild.channels.cache.find(channel => channel.id === '752664709408227518'))
	//.then((guildChannel) => guildChannel.send('`Beep, boop! mandatum is ready :)`'));

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
					client.guilds.resolve(guild.id).members.cache,
					client.guilds.resolve(guild.id).channels.resolve(config.stats.members),
					client.guilds.resolve(guild.id).channels.resolve(config.stats.bots)
				]);
			})
			.then((results) => {
				let members = bots = 0;
				results[0].each((member) => member.user.bot ? bots++ : members++);

				let oldMembersPrefix = results[1].name.split(' ')[0];
				let oldMembersSuffix = parseInt(results[1].name.split(' ')[1]);
				let oldBotsPrefix = results[2].name.split(' ')[0];
				let oldBotsSuffix = parseInt(results[2].name.split(' ')[1]);

				let newMembers = `${oldMembersPrefix} ${members}`;
				let newBots = `${oldBotsPrefix} ${bots}`;

				return Promise.all([results[1].setName(newMembers), results[2].setName(newBots)]);
			})
			.catch((err) => log.warn(err.message));
	});

	// Custom status
	client.user.setActivity(`the world burn (${prefix})`, { type: "WATCHING" })
		.catch((err) => log.warn(err));

	// Scheduled message test
	schedule.scheduleJob('0 */1 * * *', () =>
		client.guilds.fetch(guilds.bt)
			.then((guild) => guild.channels.cache.find(channel => channel.id === '752898408834138145'))
			.then((guildChannel) =>
				guildChannel.send(
					new MessageEmbed()
						.setTitle(`Clock strikes ${moment().format('h')}!`)
						.setColor(0xFFFFFF)
						.setDescription(printTime())))
			.catch((err) => log.warn(err)));
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
}

client.on('guildMemberAdd', (member) => statsUpdate(member, 0));
client.on('guildMemberRemove', (member) => statsUpdate(member, 1));

// Command processor
client.on('message', (msg) => {
	if (!msg.content.startsWith(prefix) || msg.channel.type === 'dm' || msg.author.bot) return;

	// Filter the command using the new filter system
	neoFilter(msg)
		.then((allowed) => {
			if (!allowed) return noPermission(msg);
			try { commands[msg.content.trim().substr(1).split(/ +/)[0]].execute(msg) }
			catch (err) { !(err instanceof TypeError) && log.warn(err) }
		})
		.catch((err) => log.warn(err));
});

// Swear word processor
client.on('message', (msg) => {
	if (msg.author.bot || msg.channel.type === 'dm' || !filter.guild(msg, [guilds.t, guilds.bt]) || filter.category(msg, '750773557239349259')) return;

	msg.isSwear = true;
	neoFilter(msg)
		.then((allowed) => {
			if (!allowed) return;

			let swears = fs.readJsonSync(path.join(__dirname, 'swears.json')).swears;
			for (let i = 0; i < swears.length; i++) {
				if (new RegExp(`\\b${swears[i]}\\b`, 'gi').test(msg.content.toLowerCase())) {

					let configPath = path.join(__dirname, `./config/servers/guild.${msg.guild.id}.json`);
					fs.readJson(configPath)
						.then((config) => {
							let cooldown = config.settings.swear && config.settings.swear.cooldown && config.settings.swear.cooldown[msg.channel.id] ? config.settings.swear.cooldown[msg.channel.id] : 30;

							// Return if we are within the cooldown period
							if (lastSwear[msg.channel.id] != null && (moment().format('X') - lastSwear[msg.channel.id]) < cooldown) return;

							// Curse thee heathen!
							msg.channel.send(`Watch your fucking language ${msg.author.toString()}.`)
								.then((botMsg) => trash(msg, botMsg, false))
								.catch((err) => log.warn(err));

							// Update the cooldown and log the time updated
							lastSwear[msg.channel.id] = moment().format('X');
							log.info(`Setting ${msg.guild.name}: ${msg.channel.name} swear cooldown at ${lastSwear[msg.channel.id]}`);
						});
					break;
				}
			}
		});
});

// Log in to Discord using token
client.login(fs.readJsonSync(path.join(__dirname, 'auth.json')).token)
	.catch((err) => log.warn(err));
