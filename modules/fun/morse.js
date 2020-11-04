const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');

class MorseCommand extends Command {
	execute(msg) {
		let { args } = this.parseArgs(msg);

		let max = this.getVariable('max', msg.guild.id);
		if (args === '' || args.length > max)
			return this.help(msg);

		// Strip anything but letters, numbers, and space
		args = args.join(' ').toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

		// Thanks @Cerbrus https://stackoverflow.com/a/26059399/9665770
		let morseCode = {
			'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.', 'g': '--.',
			'h': '....', 'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.',
			'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.', 's': '...', 't': '-', 'u': '..-',
			'v': '...-', 'w': '.--', 'x': '-..-', 'y': '-.--', 'z': '--..', ' ': '/', '1': '.----',
			'2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
			'8': '---..', '9': '----.', '0': '-----',
		};

		let paddedOriginal = [];
		let converted = [];

		for (let i = 0; i < args.length; i++) {
			// Convert character at i
			converted.push(morseCode[args[i]]);

			// Pad the original character
			let morseLength = converted[i].length;
			let cutLength = morseLength === 1 ? 0 : morseLength < 4 ? 1 : 2;
			paddedOriginal.push(args[i].padStart(parseInt(morseLength - cutLength), ' ').padEnd(morseLength, ' '));
		}

		return msg.channel.send(`\`${paddedOriginal.join('  ')}\`\n\`${converted.join('  ')}\``)
			.then((botMsg) => this.trash(msg, botMsg));
	}
}

module.exports = MorseCommand;
