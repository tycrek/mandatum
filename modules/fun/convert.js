const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');

class ConvertCommand extends Command {
	execute(msg) {
		const { args } = this.parseArgs(msg);

		let type = args[0].toLowerCase();
		let v1 = args[1].toLowerCase();
		let v2 = args[2] && args[2].toLowerCase();

		if (type === 'temp')
			return msg.reply(
				v1.includes('c')
					? (`${v1.replace('c', '')} Celsius is ${((parseInt(v1.replace('c', '')) * 1.8) + 32).toFixed(2)} Fahrenheit`)
					: (v1.includes('f'))
						? (`${v1.replace('f', '')} Fahrenheit is ${((parseInt(v1.replace('f', '')) - 32) / 1.8).toFixed(2)} Celsius`)
						: 'No units specified')
				.then((botMsg) => this.trash(msg, botMsg));
	}
}

module.exports = ConvertCommand;
