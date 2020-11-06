const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');

class StealCommand extends Command {
	execute(msg) {
		const { args } = this.parseArgs(msg);

		//! MASSIVE rate limit if you do this too fast
		if (args.length > 5)
			return msg.reply('slow down, buckaroo! Only do 5 emoji at a time.')
				.then((botMsg) => this.trash(msg, botMsg));

		// If adding multiple emoji, wait until all have been added before replying
		return Promise.all(
			args.map((arg) =>
				new Promise((resolve, reject) =>
					new Promise((r) => r(arg.replace(/<|>/g, '')))
						.then((emoji) => ({ emoji, isUrl: emoji.split(/:(.+)/)[1].startsWith('https') }))
						.then(({ emoji, isUrl }) => ({
							url: isUrl ? emoji.split(':').slice(1).join(':') : (`https://cdn.discordapp.com/emojis/${emoji.split(':')[2]}.${emoji.startsWith('a:') ? 'gif' : 'png'}?v=1`),
							name: emoji.split(':')[isUrl ? 0 : 1]
						}))
						.then(({ url, name }) => msg.guild.emojis.create(url, name))
						.then((emoji) => resolve(emoji))
						.catch((err) => reject(err))
				)))
			.then((results) => msg.reply(`added ${results.join(' ')}`))
			.then((botMsg) => this.trash(msg, botMsg));
	}
}

module.exports = StealCommand;
