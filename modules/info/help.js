const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');
const fun = require('../fun');

class HelpCommand extends Command {
	execute(msg) {
		let Commands = require('../commands');

		const { args } = this.parseArgs(msg);
		const prefix = this.getPrefix(msg.guild.id);

		return !Commands.getCommands(args[0]) && args[0]
			? (Commands.getCommand(args[0])
				? Commands.getCommand(args[0]).help(msg)
				: msg.reply(`Command \`${args[0]}\` does not exist.`).then((botMsg) => this.trash(msg, botMsg)))
			: sendHelpEmbed(msg, mapCommands(Commands, prefix, args[0])).then((botMsg) => this.trash(msg, botMsg));
	}
}

function sendHelpEmbed(msg, fields) {
	return msg.channel.send(
		new MessageEmbed()
			.setTitle('Bot commands')
			.setColor(0xFFFF00)
			.setThumbnail('https://cdn.discordapp.com/avatars/750806884914692207/d38112a55f14509e68e9823871ecf2eb.png?size=4096')
			.setFooter('Created by tycrek')
			.addFields(fields));
}

function mapCommands(commands, prefix, category = null) {
	return category ? buildField(commands, prefix, category) : commands.getCategories().map((category) => buildField(commands, prefix, category));
}

function buildField(commands, prefix, category = null) {
	return ({
		name: category[0].toUpperCase() + category.slice(1),
		value: commands.getCommands(category).map((command) => `\`${prefix}${command.getCommandData().getCommandName()}\``).join('\n'),
		inline: true
	});
}

module.exports = HelpCommand;
