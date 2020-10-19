const CATEGORY = 'fun';

/* Imports */
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const prefix = require('../bot').prefix;
const UsageEmbed = require('../UsageEmbed');
const { log, trash, Command } = require('../utils');

// export command functions
module.exports = {

	namemc: new Command(CATEGORY, new UsageEmbed('namemc', '', false, ['username'], ['Minecraft username to get a link from NameMC']), (cmd, msg) => {
		const args = msg.content.slice(prefix.length).trim().split(/ +/);
		let command = args.shift();

		if (args.length === 0)
			return cmd.help(msg);

		msg.channel.send(
			new MessageEmbed()
				.setTitle(`${args[0]} on NameMC`)
				.setColor(0x234875)
				.setURL(`https://namemc.com/s?${args[0]}`)
				.setFooter('https://namemc.com'))
			.then((botMsg) => trash(msg, botMsg))
			.catch((err) => log.warn(err));
	}),

	btc: new Command(CATEGORY, null, (cmd, msg) =>
		fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
			.then((res) => res.json())
			.then((json) => json.bpi.USD.rate)
			.then((price) => new MessageEmbed()
				.setTitle('Current Bitcoin Price (USD)')
				.setColor(0xF79019)
				.setDescription(`$${price}`)
				.setFooter('https://www.coindesk.com/coindesk-api'))
			.then((embed) => msg.channel.send(embed))
			.then((botMsg) => trash(msg, botMsg))
			.catch((err) => log.warn(err))),

	mcskin: new Command(CATEGORY, new UsageEmbed('mcskin', '', false, ['username'], ['Minecraft username to display a skin for']), (cmd, msg) => {
		const args = msg.content.slice(prefix.length).trim().split(/ +/);
		let command = args.shift();

		if (args.length === 0)
			return cmd.help(msg);

		msg.channel.send(
			new MessageEmbed()
				.setTitle(`${args[0]}'s Minecraft skin`)
				.setColor(0xFF4136)
				.setImage(`https://minotar.net/armor/body/${args[0]}/150.png`)
				.setFooter('https://minotar.net'))
			.then((botMsg) => trash(msg, botMsg))
			.catch((err) => log.warn(err));
	}),

	shut: new Command(CATEGORY, null, (cmd, msg) =>
		msg.channel.send(
			new MessageEmbed()
				.setColor(0x0B1308)
				.setImage('https://shutplea.se/'))
			.then((botMsg) => Promise.all([trash(msg, botMsg, false), msg.delete()]))
			.catch((err) => log.warn(err))),

	/*
	face: (cmd, msg) =>
		msg.channel.send(
			new MessageEmbed()
				.setColor(0x000000)
				.setTitle('This person does not exist...')
				.setImage('https://thispersondoesnotexist.com/image')
				.setFooter('https://thispersondoesnotexist.com/')),
	*/

	inspire: new Command(CATEGORY, null, (cmd, msg) =>
		fetch('https://inspirobot.me/api?generate=true')
			.then((res) => res.text())
			.then((text) => new MessageEmbed()
				.setTitle('Be inspired...')
				.setColor(0x1D8F0A)
				.setImage(`${text}`)
				.setFooter('https://inspirobot.me/'))
			.then((embed) => msg.channel.send(embed))
			.then((botMsg) => trash(msg, botMsg))
			.catch((err) => log.warn(err))),

	meme: new Command(CATEGORY, null, (cmd, msg) =>
		fetch('https://imgflip.com/ajax_img_flip')
			.then((res) => res.text())
			.then((text) => text.split('/')[2])
			.then((meme) => new MessageEmbed()
				.setColor(0x004daa)
				.setImage(`https://i.imgflip.com/${meme}.jpg`)
				.setFooter('https://imgflip.com'))
			.then((embed) => msg.channel.send(embed))
			.then((botMsg) => trash(msg, botMsg))
			.catch((err) => log.warn(err))),

	convert: new Command(CATEGORY, null, (cmd, msg) => {
		const args = msg.content.slice(prefix.length).trim().split(/ +/);
		args.shift();

		let type = args[0].toLowerCase();
		let v1 = args[1].toLowerCase();
		let v2 = args[2] && args[2].toLowerCase();

		if (type === 'temp')
			msg.reply(
				v1.includes('c')
					? (`${v1.replace('c', '')} Celsius is ${((parseInt(v1.replace('c', '')) * 1.8) + 32).toFixed(2)} Fahrenheit`)
					: (v1.includes('f'))
						? (`${v1.replace('f', '')} Fahrenheit is ${((parseInt(v1.replace('f', '')) - 32) / 1.8).toFixed(2)} Celsius`)
						: 'No units specified')
				.then((botMsg) => trash(msg, botMsg));
	}),

	urban: new Command(CATEGORY, null, (cmd, msg) =>
		fetch('https://api.urbandictionary.com/v0/random')
			.then((res) => res.json())
			.then((json) => json.list[0])
			.then((word) =>
				msg.channel.send(
					new MessageEmbed()
						.setTitle(word.word)
						.setURL(word.permalink)
						.setDescription(`${word.definition.replace(/[\[\]]/g, '').substring(0, 200)}\n>>> ${word.example.replace(/[\[\]]/g, '').substring(0, 200)}`)
						.setTimestamp(word.written_on)
						.setFooter(`Definition by: ${word.author}`)))
			.then((botMsg) => trash(msg, botMsg))),

	morse: new Command(CATEGORY, new UsageEmbed('morse', '', false, ['text'], ['String of words to convert to morse'], [`Max of \`${'max'}\` characters`]), (cmd, msg) => { //todo: fix max parameter
		let args = msg.content.slice(prefix.length).trim().split(/ +/);
		let command = args.shift();

		cmd.getConfig(msg, 'commands morse max'.split(/ +/))
			.then((max) => {
				if (!max) max = 30;
				// Strip anything but letters, numbers, and space
				args = args.join(' ').toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

				if (args === '' || args.length > max)
					return cmd.help(msg);

				// Thanks @Cerbrus https://stackoverflow.com/a/26059399/9665770
				let morseCode = {
					'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.', 'g': '--.',
					'h': '....', 'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.',
					'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.', 's': '...', 't': '-', 'u': '..-',
					'v': '...-', 'w': '.--', 'x': '-..-', 'y': '-.--', 'z': '--..', ' ': '/', '1': '.----',
					'2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
					'8': '---..', '9': '----.', '0': '-----',
				};

				let paddedOriginal = [];
				let converted = [];

				for (i = 0; i < args.length; i++) {
					// Convert character at i
					converted.push(morseCode[args[i]]);

					// Pad the original character
					let morseLength = converted[i].length;
					let cutLength = morseLength === 1 ? 0 : morseLength < 4 ? 1 : 2;
					paddedOriginal.push(args[i].padStart(parseInt(morseLength - cutLength), ' ').padEnd(morseLength, ' '));
				}

				return { paddedOriginal, converted };
			})
			.then(({ paddedOriginal, converted }) => msg.channel.send(`\`${paddedOriginal.join('  ')}\`\n\`${converted.join('  ')}\``))
			.then((botMsg) => trash(msg, botMsg));
	}),

	schlong: new Command(CATEGORY, null, (cmd, msg) =>
		cmd.getConfig(msg, ['commands', 'schlong', 'max'])
			.then((max) => '8'.padEnd(Math.min(max ? max : 32, parseInt(msg.content.slice(prefix.length).trim().split(/ +/)[1])), '=') + 'D')
			.then((schlong) => msg.channel.send(schlong))
			.then((botMsg) => trash(msg, botMsg))
			.catch((err) => log.warn(err))),

	xd: new Command(CATEGORY, null, (cmd, msg) => {
		let doUpper = msg.content[1] === msg.content[1].toUpperCase();
		cmd.getConfig(msg, ['commands', 'xd', 'max'])
			.then((max) => (doUpper ? 'XD' : 'xd').padEnd(Math.min(max ? max : 32, parseInt(msg.content.slice(prefix.length).trim().split(/ +/)[1])), doUpper ? 'D' : 'd'))
			.then((schlong) => msg.channel.send(schlong))
			.then((botMsg) => trash(msg, botMsg))
			.catch((err) => log.warn(err));
	})
}

module.exports.XD = module.exports.xd;
