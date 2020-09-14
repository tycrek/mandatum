/* Imports */
const { Client, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const prefix = require('../bot').prefix;
const UsageEmbed = require('../UsageEmbed');

// export command functions
module.exports = {

	namemc: (msg) => {
		const args = msg.content.slice(prefix.length).trim().split(/ +/);
		let command = args.shift();

		if (args.length === 0)
			return msg.channel.send(new UsageEmbed(command, '', false, ['username'], ['Minecraft username to get a link from NameMC']));

		msg.channel.send(new MessageEmbed()
			.setTitle(`${args[0]} on NameMC`)
			.setColor(0x234875)
			.setURL(`https://namemc.com/s?${args[0]}`)
			.setFooter('https://namemc.com'))
			.catch((err) => log.warn(err));
	},

	btc: (msg) =>
		fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
			.then((res) => res.json())
			.then((json) => json.bpi.USD.rate)
			.then((price) => new MessageEmbed()
				.setTitle('Current Bitcoin Price (USD)')
				.setColor(0xF79019)
				.setDescription(`$${price}`)
				.setFooter('https://www.coindesk.com/coindesk-api'))
			.then((embed) => msg.channel.send(embed))
			.catch((err) => log.warn(err)),

	mcskin: (msg) => {
		const args = msg.content.slice(prefix.length).trim().split(/ +/);
		let command = args.shift();

		if (args.length === 0)
			return msg.channel.send(new UsageEmbed(command, '', false, ['username'], ['Minecraft username to display a skin for']));

		msg.channel.send(new MessageEmbed()
			.setTitle(`${args[0]}'s Minecraft skin`)
			.setColor(0xFF4136)
			.setImage(`https://minotar.net/armor/body/${args[0]}/150.png`)
			.setFooter('https://minotar.net'))
			.catch((err) => log.warn(err));
	},

	shut: (msg) =>
		msg.channel.send(new MessageEmbed()
			.setColor(0x0B1308)
			.setImage('https://shutplea.se/'))
			.then(() => msg.delete())
			.catch((err) => log.warn(err)),

	/*
	face: (msg) =>
		msg.channel.send(new MessageEmbed()
			.setColor(0x000000)
			.setTitle('This person does not exist...')
			.setImage('https://thispersondoesnotexist.com/image')
			.setFooter('https://thispersondoesnotexist.com/')),
	*/

	inspire: (msg) =>
		fetch('https://inspirobot.me/api?generate=true')
			.then((res) => res.text())
			.then((text) => new MessageEmbed()
				.setTitle('Be inspired...')
				.setColor(0x1D8F0A)
				.setImage(`${text}`)
				.setFooter('https://inspirobot.me/'))
			.then((embed) => msg.channel.send(embed))
			.catch((err) => log.warn(err)),

	meme: (msg) =>
		fetch('https://imgflip.com/ajax_img_flip')
			.then((res) => res.text())
			.then((text) => text.split('/')[2])
			.then((meme) => new MessageEmbed()
				.setColor(0x004daa)
				.setImage(`https://i.imgflip.com/${meme}.jpg`)
				.setFooter('https://imgflip.com'))
			.then((embed) => msg.channel.send(embed))
			.catch((err) => log.warn(err)),

	convert: (msg) => {
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
						: 'No units specified');
	},

	badword: (msg) => {
		let words = require('../badwords.json');
		msg.channel.send(words[Math.floor(Math.random() * words.length)]);
	},

	urban: (msg) =>
		fetch('https://api.urbandictionary.com/v0/random')
			.then((res) => res.json())
			.then((json) => json.list[0])
			.then((word) => msg.channel.send(new MessageEmbed()
				.setTitle(word.word)
				.setURL(word.permalink)
				.setDescription(`${word.definition.replace(/[\[\]]/g, '').substring(0, 200)}\n>>> ${word.example.replace(/[\[\]]/g, '').substring(0, 200)}`)
				.setTimestamp(word.written_on)
				.setFooter(`Definition by: ${word.author}`)))
}