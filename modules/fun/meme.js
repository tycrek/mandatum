const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

class MemeCommand extends Command {
	execute(msg) {
		return fetch('https://imgflip.com/ajax_img_flip')
			.then((res) => res.text())
			.then((text) => text.split('/')[2])
			.then((meme) => new MessageEmbed()
				.setColor(0x004daa)
				.setImage(`https://i.imgflip.com/${meme}.jpg`)
				.setFooter('https://imgflip.com'))
			.then((embed) => msg.channel.send(embed))
			.then((botMsg) => this.trash(msg, botMsg));
	}
}

module.exports = MemeCommand;
