/* Imports */
const { Client, MessageEmbed } = require('discord.js');

// export command functions
module.exports = {

	commands: (msg) => {
		let text = '';
		for (let command in require('../bot').commands) text = `${text}\`>${command}\`\n`;

		msg.channel.send(new MessageEmbed()
			.setTitle('Bot commands')
			.setColor(0xFFFF00)
			.setDescription(text));
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