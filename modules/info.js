const CATEGORY = 'info';

/* Imports */
const { MessageEmbed } = require('discord.js');
const UsageEmbed = require('../UsageEmbed');
const { log, trash, Command } = require('../utils');

// export command functions
module.exports = {

	// Thanks coolguy284#5720 for making this hella smaller
	help: new Command(CATEGORY, null, (cmd, msg) =>
		msg.channel.send(
			new MessageEmbed()
				.setTitle('Bot commands')
				.setColor(0xFFFF00)
				.setThumbnail('https://cdn.discordapp.com/avatars/750806884914692207/d38112a55f14509e68e9823871ecf2eb.png?size=4096')
				.setFooter('Created by tycrek')
				.addFields(['info', 'fun', 'utility', 'voice', 'moderator', 'admin'].map(category => ({
					name: category[0].toUpperCase() + category.slice(1), // crappy way to capitalize 1st letter
					value: Object.keys(require('./' + category)).map(c => `\`>${c}\``).join('\n'),
					inline: true
				}))))
			.then((botMsg) => trash(msg, botMsg))
			.catch((err) => log.warn(err))),

	website: new Command(CATEGORY, null, (cmd, msg) =>
		msg.channel.send('Visit: https://jmoore.dev/')
			.then((botMsg) => trash(msg, botMsg))
			.catch((err) => log.warn(err))),

	github: new Command(CATEGORY, null, (cmd, msg) =>
		msg.channel.send('Visit: https://github.com/tycrek')
			.then((botMsg) => trash(msg, botMsg))
			.catch((err) => log.warn(err))),

	source: new Command(CATEGORY, null, (cmd, msg) =>
		msg.channel.send(
			new MessageEmbed()
				.setTitle('Bot source code')
				.setColor(0x181A1B)
				.setURL('https://github.com/tycrek/mandatum')
				.setFooter('Check out my source code on GitHub!'))
			.then((botMsg) => trash(msg, botMsg))
			.catch((err) => log.warn(err))),

	about: new Command(CATEGORY, null, (cmd, msg) =>
		msg.channel.send(
			new MessageEmbed({
				"title": "Hello! :wave:",
				"description": "I'm a Discord bot. You can check out my **[source code](https://github.com/tycrek/mandatum/)**.\n\n**What does \"mandatum\" mean?** It's Latin for \"command\".\n\nRun `>help` to see a list of commands.\n",
				"color": 16776960,
				"footer": "Created by tycrek",
				"thumbnail": "https://cdn.discordapp.com/avatars/750806884914692207/d38112a55f14509e68e9823871ecf2eb.png?size=4096"
			})
				.setThumbnail('https://cdn.discordapp.com/avatars/750806884914692207/d38112a55f14509e68e9823871ecf2eb.png?size=4096'))
			.then((botMsg) => trash(msg, botMsg)))
}

module.exports.commands = module.exports.help;
