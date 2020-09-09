/* Imports */
const { Client, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const prefix = require('../bot').prefix;

// export command functions
module.exports = {

	namemc: (msg) => {
		const args = msg.content.slice(prefix.length).trim().split(/ +/);
		msg.channel.send(new MessageEmbed()
			.setTitle(`${args[1]} on NameMC`)
			.setColor(0x234875)
			.setURL(`https://namemc.com/s?${args[1]}`)
			.setFooter('https://namemc.com'));
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
			.then((embed) => msg.channel.send(embed)),

	mcskin: (msg) => {
		const args = msg.content.slice(prefix.length).trim().split(/ +/);
		msg.channel.send(new MessageEmbed()
			.setTitle(`${args[1]}'s Minecraft skin`)
			.setColor(0xFF4136)
			.setImage(`https://minotar.net/armor/body/${args[1]}/150.png`)
			.setFooter('https://minotar.net'));
	},

	shut: (msg) => {
		msg.channel.send(new MessageEmbed()
			.setColor(0x0B1308)
			.setImage('https://shutplea.se/'));
		msg.delete();
	},

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
			.then((embed) => msg.channel.send(embed)),

	meme: (msg) =>
		fetch('https://imgflip.com/ajax_img_flip')
			.then((res) => res.text())
			.then((text) => text.split('/')[2])
			.then((meme) => new MessageEmbed()
				.setColor(0x004daa)
				.setImage(`https://i.imgflip.com/${meme}.jpg`)
				.setFooter('https://imgflip.com'))
			.then((embed) => msg.channel.send(embed))

}