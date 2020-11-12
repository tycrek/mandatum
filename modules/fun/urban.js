const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

class UrbanCommand extends Command {
	execute(msg) {
		return fetch('https://api.urbandictionary.com/v0/random')
			.then((res) => res.json())
			.then((json) => json.list[0])
			.then((word) =>
				msg.channel.send(
					new MessageEmbed()
						.setTitle(word.word)
						.setURL(word.permalink)
						.setDescription(`${word.definition.replace(/[\[\]]/g, '').substring(0, 200)}\n>>> ${word.example.replace(/[\[\]]/g, '').substring(0, 200)}`)
						.setTimestamp(word.written_on)
						.setFooter(`Definition by: ${word.author}`)))
			.then((botMsg) => this.trash(msg, botMsg));
	}
}

module.exports = UrbanCommand;
