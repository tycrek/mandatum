const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');
const { categories } = require('../../utils');

class HelpCommand extends Command {
	execute(msg) {
		const { args } = this.parseArgs(msg);
		const prefix = this.getPrefix(msg.guild.id);
		const commands = Object.assign({}, ...categories.map((category) => require(`../${category}`)));

		return args.length == 1
			? (commands[args[0]] && commands[args[0]].usage ? commands[args[0]].help(msg) : msg.reply(`command \`${args[0]}\` ether does not exist or does not have a help page.`))
			: msg.channel.send(
				new MessageEmbed()
					.setTitle('Bot commands')
					.setColor(0xFFFF00)
					.setThumbnail('https://cdn.discordapp.com/avatars/750806884914692207/d38112a55f14509e68e9823871ecf2eb.png?size=4096')
					.setFooter('Created by tycrek')
					.addFields(categories.map((category) => ({
						name: category[0].toUpperCase() + category.slice(1), // crappy way to capitalize 1st letter
						value: Object.keys(require(`../${category}`)).map(command => `\`>${command}\``).join('\n'),
						inline: true
					})))).then((botMsg) => this.trash(msg, botMsg))
	}
}

module.exports = HelpCommand;
