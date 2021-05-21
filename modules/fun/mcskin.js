const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

class MCSkinCommand extends Command {
	execute(msg) {
		const { args } = this.parseArgs(msg);
		
		return fetch(`https://api.mojang.com/users/profiles/minecraft/${args[0]}`)
			.then(res => res.json())
			.then(json => new MessageEmbed()
			     .setTitle(`${args[0]}'s Minecraft skin`)
			     .setColor(0xFF4136)
			     .setImage(`https://crafatar.com/renders/body/${json.id}.png`)
			     .setFooter('https://crafatar.com/'))
			.then(embed => msg.channel.send(embed))
			.then(botMsg => this.trash(msg, botMsg));
	}
}

module.exports = MCSkinCommand;
