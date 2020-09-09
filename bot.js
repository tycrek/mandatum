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

/* Imports */

// discord.js for Discord API
const { Client, MessageEmbed } = require('discord.js');

// path & fs-extra for filesystem operations
const path = require('path');
const fs = require('fs-extra');

// for scheduling automated messages
const schedule = require('node-schedule');

// anything time related such as the cooldown
const moment = require('moment');

const { log, printTime, filter } = require('./utils');

/* Variables */

// servers where the bot is active
const guilds = {
	t: '750773045974663208',
	d: '742574545612963870',
	bt: '751793035565727816',
	y: '333972588567068672'
};

// bot owner, has access to everything
const owner = '324679696182673408';

// Cooldown timer for last swear in channel //! currently behaves globally (swear in 1 server affects cooldown in another server)
let lastSwear = {};

// Prefix for bot commands
const prefix = '>';

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

	// Custom status
	client.user.setActivity('the world burn (>)', { type: "WATCHING" })
		.catch((err) => log.warn(err));

	// Scheduled message test
	schedule.scheduleJob('0 */1 * * *', () =>
		client.guilds.fetch(guilds.bt)
			.then((guild) => guild.channels.cache.find(channel => channel.id === '752898408834138145'))
			.then((guildChannel) => guildChannel.send(new MessageEmbed()
				.setTitle(`Clock strikes ${moment().format('h')}!`)
				.setColor(0xFFFFFF)
				.setDescription(printTime())))
			.catch((err) => log.warn(err)));
});

client.on('warn', (warn) => log.warn(warn));
client.on('error', (error) => log.error(error));

// Command processor
client.on('message', (msg) => {
	if (!msg.content.startsWith(prefix) || msg.channel.type === 'dm' || msg.author.bot) return;
	try { commands[Object.keys(commands).find(key => msg.content.trim().substr(1).split(/ +/)[0] === key)](msg) }
	catch (err) { !(err instanceof TypeError) && log.warn(err) }
});

// Swear word processor
client.on('message', (msg) => {
	if (msg.author.bot || msg.channel.type === 'dm' || !filter.guild(msg, [guilds.t, guilds.bt]) || filter.category(msg, '750773557239349259')) return;

	let swears = fs.readJsonSync(path.join(__dirname, 'swears.json')).swears;
	for (let i = 0; i < swears.length; i++) {
		if (new RegExp(`\\b${swears[i]}\\b`, 'gi').test(msg.content.toLowerCase())) {

			// Return if we are within the cooldown period
			if (lastSwear[msg.channel.id] != null && (moment().format('X') - lastSwear[msg.channel.id]) < 30) return;

			// Curse thee heathen!
			msg.channel.send(`Watch your fucking language ${msg.author.toString()}.`)
				.catch((err) => log.warn(err));

			// Update the cooldown and log the time updated
			lastSwear[msg.channel.id] = moment().format('X');
			log.info(`Setting ${msg.guild.name}: ${msg.channel.name} swear cooldown at ${lastSwear[msg.channel.id]}`);
			break;
		}
	}
});

// Log in to Discord using token
client.login(fs.readJsonSync(path.join(__dirname, 'auth.json')).token)
	.catch((err) => log.warn(err));
