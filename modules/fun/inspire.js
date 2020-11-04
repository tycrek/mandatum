const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

class InspireCommand extends Command {
	execute(msg) {
		return fetch('https://inspirobot.me/api?generate=true')
			.then((res) => res.text())
			.then((text) => new MessageEmbed()
				.setTitle('Be inspired...')
				.setColor(0x1D8F0A)
				.setImage(`${text}`)
				.setFooter('https://inspirobot.me/'))
			.then((embed) => msg.channel.send(embed))
			.then((botMsg) => this.trash(msg, botMsg));
	}
}

module.exports = InspireCommand;
