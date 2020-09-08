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

// for fetching data from the net
const fetch = require('node-fetch');

// for scheduling automated messages
const schedule = require('node-schedule');

// for fun :)
const UUID = require('uuid').v4;

// anything time related such as the cooldown
const moment = require('moment');

// Good logging tool
const log = require('pino')({
	prettyPrint: true,
	timestamp: () => `,"time": ${moment().format('YYYY-MM-DD hh:mm:ss A')} `
});

/* Variables */

// Cooldown timer for last swear in channel //! currently behaves globally (swear in 1 server affects cooldown in another server)
let lastSwear;

/* Client setup */

const client = new Client();

// When client is ready (after it logs in)
client.once('ready', () => {
	log.info('mandatum ready');

	// Custom status
	client.user.setActivity('the world burn (>)', { type: "WATCHING" });

	// Scheduled message test
	schedule.scheduleJob('*/10 * * * * *', () => {
		let embed = new MessageEmbed()
			.setTitle('Current time')
			.setColor(0xFFFFFF)
			.setDescription(printTime())
		client.guilds.fetch('751793035565727816')
			.then((guild) => guild.channels.cache.find(channel => channel.id === '752679477787623544'))
			.then((guildChannel) => guildChannel.send(embed));
	});
});

const prefix = '>';
const commands = {
	commands: (msg) => mCommands(msg),
	website: (msg) => website(msg),
	github: (msg) => github(msg),
	namemc: (msg) => namemc(msg),
	btc: (msg) => btc(msg),
	mcskin: (msg) => mcskin(msg),
	source: (msg) => source(msg),
	link: (msg) => link(msg),
	shut: (msg) => shut(msg),
	search: (msg) => search(msg),
	//face: (msg) => face(msg), // ! Broken right now, caching on server
	inspire: (msg) => inspire(msg),
	uuid: (msg) => uuid(msg),
	meme: (msg) => meme(msg),
	//release: (msg) => release(msg)
};

// Command processor
client.on('message', (msg) => {
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;
	try { commands[Object.keys(commands).find(key => msg.content.trim().substr(1).split(/ +/)[0] === key)](msg) }
	catch (err) { !(err instanceof TypeError) && log.warn(err) }
});

// Swear word processor
client.on('message', (msg) => {
	let swears = fs.readJsonSync(path.join(__dirname, 'swears.json')).swears;

	for (let i = 0; i < swears.length; i++) {
		if (msg.author.bot || !(msg.guild.id == '750773045974663208' || msg.guild.id == '751793035565727816')) break;

		if (new RegExp(`\\b${swears[i]}\\b`, 'gi').test(msg.content.toLowerCase())) {
			if (lastSwear != null && (moment().format('X') - lastSwear) < 30) return;
			msg.channel.send(`Watch your fucking language ${msg.author.toString()}.`);
			lastSwear = moment().format('X');
			break;
		}
	}
});

// Log in to Discord using token
client.login(fs.readJsonSync(path.join(__dirname, 'auth.json')).token);

/* Functions */

function printTime() {
	return moment().format('h:mm:ss a, MMMM Do, YYYY')
}

// command functions

function mCommands(msg) {
	let text = '';
	for (let command in commands) text = `${text}\`>${command}\`\n`;

	let embed = new MessageEmbed()
		.setTitle('Bot commands')
		.setColor(0xFFFF00)
		.setDescription(text);
	msg.channel.send(embed);
}

function website(msg) {
	msg.channel.send('Visit: https://jmoore.dev/');
	msg.delete();
}

function github(msg) {
	msg.channel.send('Visit: https://github.com/tycrek');
	msg.delete();
}

function namemc(msg) {
	const args = msg.content.slice(prefix.length).trim().split(/ +/);
	let embed = new MessageEmbed()
		.setTitle(`${args[1]} on NameMC`)
		.setColor(0x234875)
		.setURL(`https://namemc.com/s?${args[1]}`)
		.setFooter('https://namemc.com');
	msg.channel.send(embed);
}

function btc(msg) {
	fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
		.then((res) => res.json())
		.then((json) => json.bpi.USD.rate)
		.then((price) => new MessageEmbed()
			.setTitle('Current Bitcoin Price (USD)')
			.setColor(0xF79019)
			.setDescription(`$${price}`)
			.setFooter('https://www.coindesk.com/coindesk-api'))
		.then((embed) => msg.channel.send(embed));
}

function mcskin(msg) {
	const args = msg.content.slice(prefix.length).trim().split(/ +/);
	let embed = new MessageEmbed()
		.setTitle(`${args[1]}'s Minecraft skin`)
		.setColor(0xFF4136)
		.setImage(`https://minotar.net/armor/body/${args[1]}/150.png`)
		.setFooter('https://minotar.net');
	msg.channel.send(embed);
}

function source(msg) {
	let embed = new MessageEmbed()
		.setTitle(`Bot source code`)
		.setColor(0x181A1B)
		.setURL(`https://github.com/tycrek/mandatum`)
		.setFooter('Check out my source code on GitHub!');
	msg.channel.send(embed);
}

function link(msg) {
	const args = msg.content.slice(prefix.length).trim().split(/ +/);
	let embed = new MessageEmbed()
		.setTitle(args[1])
		.setColor(0x455A64)
		.setURL(`https://${args[1].toLowerCase()}`)
	msg.channel.send(embed);
	msg.delete();
}

function shut(msg) {
	let embed = new MessageEmbed()
		.setColor(0x0B1308)
		.setImage(`https://shutplea.se/`)
	msg.channel.send(embed);
	msg.delete();
}

function search(msg) {
	const args = msg.content.slice(prefix.length).trim().split(/ +/);
	args.shift();
	let embed = new MessageEmbed()
		.setColor(0xE0632F)
		.setAuthor(`Searching "${args.join(' ')}" for ${msg.author.username}`)
		.setDescription(`https://duckduckgo.com/?q=${args.join('+')}`)
	msg.channel.send(embed);
}

function face(msg) {
	let embed = new MessageEmbed()
		.setColor(0x000000)
		.setTitle('This person does not exist...')
		.setImage(`https://thispersondoesnotexist.com/image`)
		.setFooter('https://thispersondoesnotexist.com/');
	msg.channel.send(embed);
}

function inspire(msg) {
	fetch('https://inspirobot.me/api?generate=true')
		.then((res) => res.text())
		.then((text) => new MessageEmbed()
			.setTitle('Be inspired...')
			.setColor(0x1D8F0A)
			.setImage(`${text}`)
			.setFooter('https://inspirobot.me/'))
		.then((embed) => msg.channel.send(embed));
}

function uuid(msg) {
	let embed = new MessageEmbed()
		.setTitle('Here\'s your UUID:')
		.setColor(0x000000)
		.setDescription(`\`${UUID()}\``)
	msg.channel.send(embed);
}

function meme(msg) {
	fetch('https://imgflip.com/ajax_img_flip')
		.then((res) => res.text())
		.then((text) => text.split('/')[2])
		.then((meme) => new MessageEmbed()
			.setColor(0x004daa)
			.setImage(`https://i.imgflip.com/${meme}.jpg`)
			.setFooter('https://imgflip.com'))
		.then((embed) => msg.channel.send(embed));
}

function release(msg) {
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
			{ name: 'Changes', value: changeText },
			{ name: 'Fixed', value: fixText },
		);
	msg.channel.send(embed);
}