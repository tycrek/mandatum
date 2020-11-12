const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');

class MCSkinCommand extends Command {
	execute(msg) {
		const { args } = this.parseArgs(msg);

		return msg.channel.send(
			new MessageEmbed()
				.setTitle(`${args[0]}'s Minecraft skin`)
				.setColor(0xFF4136)
				.setImage(`https://minotar.net/armor/body/${args[0]}/150.png`)
				.setFooter('https://minotar.net'))
			.then((botMsg) => this.trash(msg, botMsg));
	}
}

module.exports = MCSkinCommand;
