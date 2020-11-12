const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

class BTCCommand extends Command {
	execute(msg) {
		return fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
			.then((res) => res.json())
			.then((json) => json.bpi.USD.rate)
			.then((price) => new MessageEmbed()
				.setTitle('Current Bitcoin Price (USD)')
				.setColor(0xF79019)
				.setDescription(`$${price}`)
				.setFooter('https://www.coindesk.com/coindesk-api'))
			.then((embed) => msg.channel.send(embed))
			.then((botMsg) => this.trash(msg, botMsg));
	}
}

module.exports = BTCCommand;
