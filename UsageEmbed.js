/**
 * UsageEmbed
 * 
 * Created by tycrek
 */

const { MessageEmbed } = require('discord.js');

const paramLead = '  '; // Displayed before the parameter help line. This is UNRELATED to prefix; > has best results
const newLine = '\n\n';

class UsageEmbed extends MessageEmbed {
	/**
	 * Display a helpful usage Embed for a command
	 * @param {string} command Command the usage embed is for
	 * @param {string} separator Item that divides parameters (allows for multiple words per paremeter)
	 * @param {boolean} wrap Place the separator on both sides of the parameter (useful for quotations as separators)
	 * @param {string[]} parameters Parameters sent to the command
	 * @param {string[]} descriptions Descriptions of each parameter
	 * @param {string[]} notes Notes/tips on using the command (can be null)
	 */
	constructor(command, separator, wrap, parameters, descriptions, notes = null) {
		//TODO: Remove neoCommand after migration change the constructor to include prefix
		let neoCommand = require('./modules/commands').getCommand(command);
		let prefix = require('./bot').prefix; // * Copy/pasting? This line may be different for you
		super({
			title: 'Usage for ' + command[0].toUpperCase() + command.slice(1),
			description: (
				//! STEP 1: First line
				(`\`${prefix}${command} ${wrap ? separator.split('').shift() : ''}${parameters.join(separator)}${wrap ? separator.split('').pop() : ''}\``)

				+ newLine +

				//! STEP 2: Description
				//TODO: Remove the condition once all commands are migrated
				(neoCommand ? '**Description**\n' + neoCommand.getCommandData().getDescription() : '')

				+ newLine +

				//! STEP 3: Parameter text
				(parameters.length > 0 ? (['**Parameters**'].concat(parameters.map((param) =>
					`\`${(paramLead + param).padEnd(parameters.reduce((a, b) =>
						a.length > b.length ? a : b).length + paramLead.length + (' '.length * 4))}\` ${descriptions[parameters.indexOf(param)]}`)).join('\n')) : '')

				+ newLine +

				//! STEP 4: Notes
				(notes && notes.length !== 0 ? `Note: ${notes.join('\nNote: ')}` : '')
			)
		});
	}
}

module.exports = UsageEmbed;
