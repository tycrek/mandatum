/* Imports */
const { Client, MessageEmbed } = require('discord.js');

// export command functions
module.exports = {

	// Thanks coolguy284#5720 for making this hella smaller
	help: (msg) =>
		msg.channel.send(new MessageEmbed()
			.setTitle('Bot commands')
			.setColor(0xFFFF00)
			.setThumbnail('https://cdn.discordapp.com/avatars/750806884914692207/d38112a55f14509e68e9823871ecf2eb.png?size=4096')
			.setFooter('Created by tycrek')
			.addFields(['info', 'fun', 'utility', 'moderator', 'admin'].map(category => ({
				name: category[0].toUpperCase() + category.slice(1), // crappy way to capitalize 1st letter
				value: Object.keys(require('./' + category)).map(c => `\`>${c}\``).join('\n'),
				inline: true
			}))))
			.catch((err) => log.warn(err)),

	website: (msg) =>
		msg.channel.send('Visit: https://jmoore.dev/')
			.then(() => msg.delete())
			.catch((err) => log.warn(err)),

	github: (msg) =>
		msg.channel.send('Visit: https://github.com/tycrek')
			.then(() => msg.delete())
			.catch((err) => log.warn(err)),

	source: (msg) =>
		msg.channel.send(new MessageEmbed()
			.setTitle('Bot source code')
			.setColor(0x181A1B)
			.setURL('https://github.com/tycrek/mandatum')
			.setFooter('Check out my source code on GitHub!'))
			.catch((err) => log.warn(err)),
}