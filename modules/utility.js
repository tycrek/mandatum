/* Imports */
const { Client, MessageEmbed } = require('discord.js');
const UUID = require('uuid').v4;
const client = require('../bot').client;
const prefix = require('../bot').prefix;

// export command functions
module.exports = {

	link: (msg) => {
		const args = msg.content.slice(prefix.length).trim().split(/ +/);
		msg.channel.send(new MessageEmbed()
			.setTitle(args[1])
			.setColor(0x455A64)
			.setURL(`https://${args[1].toLowerCase()}`))
			.then(() => msg.delete())
			.catch((err) => log.warn(err));
	},

	search: (msg) => {
		const args = msg.content.slice(prefix.length).trim().split(/ +/);
		args.shift();
		msg.channel.send(new MessageEmbed()
			.setColor(0xE0632F)
			.setAuthor(`Searching "${args.join(' ')}" for ${msg.author.username}`)
			.setDescription(`https://duckduckgo.com/?q=${args.join('+')}`))
			.catch((err) => log.warn(err));
	},

	uuid: (msg) =>
		msg.channel.send(new MessageEmbed()
			.setTitle('Here\'s your UUID:')
			.setColor(0x000000)
			.setDescription(`\`${UUID()}\``))
			.catch((err) => log.warn(err)),

	uptime: (msg) => {
		let totalSeconds = client.uptime / 1000;
		let hours = (totalSeconds / (60 * 60)).toString().split('.')[0];
		let minutes = (totalSeconds / 60 % 60).toString().split('.')[0];
		let seconds = (totalSeconds % 60).toString().split('.')[0];

		msg.channel.send(new MessageEmbed().setTitle(`Bot has been active for ${hours} hours, ${minutes} minutes, ${seconds} seconds`))
			.catch((err) => log.warn(err));
	}
}