const CATEGORY = 'utility';

/* Imports */
const { MessageEmbed } = require('discord.js');
const UUID = require('uuid').v4;
const client = require('../bot').client;
const prefix = require('../bot').prefix;
const UsageEmbed = require('../UsageEmbed');
const { log, trash, Command } = require('../utils');

// export command functions
module.exports = {

	/* link: new Command(CATEGORY, new UsageEmbed('link', '', false, ['url'], ['A URL without `https://` (example: `>link example.com`)']), (cmd, msg) => {
		const args = msg.content.slice(prefix.length).trim().split(/ +/);

		if (args.length < 2)
			return cmd.help(msg);

		msg.channel.send(
			new MessageEmbed()
				.setTitle(args[1])
				.setColor(0x455A64)
				.setURL(`https://${args[1].toLowerCase()}`))
			.then((botMsg) => Promise.all([trash(msg, botMsg, false), msg.delete()]))
			.catch((err) => log.warn(err));
	}), */

	search: new Command(CATEGORY, new UsageEmbed('search', '', false, ['query'], ['Searches `query` using DuckDuckGo'], ['You can use [DuckDuckGo Bangs](https://duckduckgo.com/bang) to redirect your search']), (cmd, msg) => {
		const args = msg.content.slice(prefix.length).trim().split(/ +/);

		if (args.length < 2)
			return cmd.help(msg);

		args.shift();
		msg.channel.send(
			new MessageEmbed()
				.setColor(0xE0632F)
				.setAuthor(`Searching "${args.join(' ')}" for ${msg.author.username}`)
				.setDescription(`https://duckduckgo.com/?q=${args.join('+')}`))
			.then((botMsg) => trash(msg, botMsg))
			.catch((err) => log.warn(err));
	}),

	uuid: new Command(CATEGORY, null, (cmd, msg) =>
		msg.channel.send(
			new MessageEmbed()
				.setTitle('Here\'s your UUID:')
				.setColor(0x000000)
				.setDescription(`\`${UUID()}\``))
			.then((botMsg) => trash(msg, botMsg))
			.catch((err) => log.warn(err))),

	uptime: new Command(CATEGORY, null, (cmd, msg) => {
		let totalSeconds = client.uptime / 1000;
		let hours = (totalSeconds / (60 * 60)).toString().split('.')[0];
		let minutes = (totalSeconds / 60 % 60).toString().split('.')[0];
		let seconds = (totalSeconds % 60).toString().split('.')[0];

		msg.channel.send(
			new MessageEmbed()
				.setTitle(`Bot has been active for ${hours} hours, ${minutes} minutes, ${seconds} seconds`))
			.then((botMsg) => trash(msg, botMsg))
			.catch((err) => log.warn(err));
	}),

	roles: new Command(CATEGORY, null, (cmd, msg) => {
		cmd.getConfig(msg, ['settings', 'langroles', 'langroles'])
			.then((config) =>
				msg.channel.send(
					new MessageEmbed()
						.setTitle('Roles')
						.setDescription(Object.keys(config).map(key => `\`${key}\``).slice(1).join(', '))
				))
			.then((botMsg) => trash(msg, botMsg))
			.catch((err) => log.warn(err));
	}),

	role: new Command(CATEGORY, new UsageEmbed('role', '', false, ['rolename'], ['The role to apply. Prefix with `-` to remove a role. Role names **must** perfectly match, including capitalization!'], ['Run `>roles` to see a list of available roles', 'Multiple roles can be added at once if separated by a space']), (cmd, msg) => {
		const args = msg.content.slice(prefix.length).trim().split(/ +/);
		const command = args.shift();

		if (args.length < 1)
			return cmd.help(msg);

		cmd.getConfig(msg, ['settings', 'langroles', 'langroles'])
			.then((roles) =>
				Promise.all([msg.member.roles.add(roles['⸻ LANGUAGES ⸻'])].concat(args.map((arg) =>
					Object.keys(roles).includes(arg.replace('-', '')) && !arg.includes('LANGUAGES') ? (arg.startsWith('-') ? msg.member.roles.remove(roles[arg.replace('-', '')]) : msg.member.roles.add(roles[arg.replace('-', '')])) : ''))))
			.then(() => msg.channel.send('Done!'))
			.then((botMsg) => trash(msg, botMsg))
			.catch((err) => log.warn(err));
	})
}