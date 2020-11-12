const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');

class AboutCommand extends Command {
	execute(msg) {
		return msg.channel.send(
			new MessageEmbed({
				"title": "Hello! :wave:",
				"description": "I'm a Discord bot. You can check out my **[source code](https://github.com/tycrek/mandatum/)** on GitHub.\n\n**What does \"mandatum\" mean?** It's Latin for \"command\".\n\nRun `>help` to see a list of commands.\n",
				"color": 16776960,
				"footer": "Created by tycrek",
				"thumbnail": "https://cdn.discordapp.com/avatars/750806884914692207/d38112a55f14509e68e9823871ecf2eb.png?size=4096"
			})
				.setThumbnail('https://cdn.discordapp.com/avatars/750806884914692207/d38112a55f14509e68e9823871ecf2eb.png?size=4096'))
			.then((botMsg) => this.trash(msg, botMsg))
	}
}

module.exports = AboutCommand;
