/**
 * UsageEmbed
 * 
 * Created by tycrek
 */

const { MessageEmbed } = require('discord.js');

const paramLead = '> '; // Displayed before the parameter help line. This is UNRELATED to prefix; > has best results

class UsageEmbed extends MessageEmbed {
	/**
	 * Display a helpful usage Embed for a command
	 * @param {string} command Command the usage embed is for
	 * @param {string} separator Item that divides parameters (allows for multiple words per paremeter)
	 * @param {boolean} wrap Place the separator on both sides of the parameter (useful for quotations as separators)
	 * @param {string[]} parameters Parameters sent to the command
	 * @param {string[]} descriptions Descriptions of each parameter
	 * @param {string[]} notes Notes/tips on using the command
	 */
	constructor(command, separator, wrap, parameters, descriptions, notes) {
		let prefix = require('./bot').prefix; // * Copy/pasting? This line may be different for you

		//! STEP 1: First line
		let usageLine = `\`${prefix}${command} ${wrap ? separator.split('').shift() : ''}${parameters.join(separator)}${wrap ? separator.split('').pop() : ''}\``;

		//! STEP 2: Parameter text
		let parameterLines = parameters.map((param) =>
			`\`${(paramLead + param).padEnd(parameters.reduce((a, b) =>
				a.length > b.length ? a : b).length + paramLead.length + (' '.length * 4))}\` ${descriptions[parameters.indexOf(param)]}`).join('\n');

		//! STEP 3: Notes
		let noteLines = notes && notes.length !== 0 ? `Note: ${notes.join('; ')}` : '';

		//! STEP 4: Pass this all back to Discord.js MessageEmbed
		super({
			title: `${prefix}${command} Usage`,
			description: usageLine + '\n\n' + parameterLines + '\n\n' + noteLines
		});
	}
}

module.exports = UsageEmbed;
