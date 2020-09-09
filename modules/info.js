/* Imports */
const { Client, MessageEmbed } = require('discord.js');

// export command functions
module.exports = {

	help: (msg) => {
		let info = [];
		let fun = [];
		let utility = [];
		let moderator = [];
		let admin = [];

		for (let command in require('./info')) info.push(`\`>${command}\``);
		for (let command in require('./fun')) fun.push(`\`>${command}\``);
		for (let command in require('./utility')) utility.push(`\`>${command}\``);
		for (let command in require('./moderator')) moderator.push(`\`>${command}\``);
		for (let command in require('./admin')) admin.push(`\`>${command}\``);

		msg.channel.send(new MessageEmbed()
			.setTitle('Bot commands')
			.setColor(0xFFFF00)
			.setThumbnail('https://cdn.discordapp.com/avatars/750806884914692207/d38112a55f14509e68e9823871ecf2eb.png?size=4096')
			.setFooter('Created by tycrek')
			.addFields(
				{ name: 'Info', value: info.join('\n') || 'None', inline: true },
				{ name: '\u200B', value: '\u200B', inline: true },
				{ name: 'Fun', value: fun.join('\n') || 'None', inline: true },

				{ name: '\u200B', value: '\u200B', inline: true },
				{ name: '\u200B', value: '\u200B', inline: true },
				{ name: '\u200B', value: '\u200B', inline: true },

				{ name: 'Utility', value: utility.join('\n') || 'None', inline: true },
				{ name: '\u200B', value: '\u200B', inline: true },
				{ name: 'Moderator', value: moderator.join('\n') || 'None', inline: true },

				{ name: '\u200B', value: '\u200B', inline: true },
				{ name: '\u200B', value: '\u200B', inline: true },
				{ name: '\u200B', value: '\u200B', inline: true },

				{ name: 'Admin', value: admin.join('\n') || 'None', inline: true },
			));
	},

	website: (msg) => {
		msg.channel.send('Visit: https://jmoore.dev/');
		msg.delete();
	},

	github: (msg) => {
		msg.channel.send('Visit: https://github.com/tycrek');
		msg.delete();
	},

	source: (msg) =>
		msg.channel.send(new MessageEmbed()
			.setTitle('Bot source code')
			.setColor(0x181A1B)
			.setURL('https://github.com/tycrek/mandatum')
			.setFooter('Check out my source code on GitHub!')),
}