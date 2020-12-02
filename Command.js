const path = require('path');
const fs = require('fs-extra');
const UsageEmbed = require('./UsageEmbed');
const { CommandData, CommandVariables, CommandVariable } = require('./CommandData');
const { readJson, writeJson, log, splitArgs, trash } = require('./utils');
const RequiredError = require('./RequiredError');
const Message = require('discord.js').Message;

class Command {

	/**
	 * Build a new command
	 * @param {CommandData} commandData Command data used to build the command object
	 */
	constructor(commandData) {
		this.command = commandData.getCommandName();
		this.commandData = commandData;
		this.config = {};
	}

	/**
	 * Load the config for the server (called after constructor)
	 * @returns {Command} This command
	 */
	loadConfig() {
		let guilds = require('./config/guilds.json').guilds;
		guilds.forEach((guildId) => {
			let guildConfigPath = path.join(__dirname, `./config/servers/guild.${guildId}.json`);
			if (fs.existsSync(guildConfigPath)) this.config[guildId] = require(guildConfigPath);
			else {
				let template = require('./config/servers/__template.json');
				template.name = '__deprecated_field__';
				template.id = guildId;
				writeJson(guildConfigPath, template);
				this.config[guildId] = template;
			}
		});
		return this;
	}

	/**
	 * Parse the command and arguments for the command from message content
	 * @param {Message} msg Message to parse arguments from
	 * @param {boolean} onlyCommand Set to true to skip parsing arguments and only return the command
	 * @returns {Object} Object containing keys 'command' and potentially 'args'
	 */
	parseArgs(msg, onlyCommand = false) {
		let split = splitArgs(msg, this.getPrefix(msg.guild.id));

		let command = split.shift();
		if (onlyCommand) return { command };

		if (checkRequired(this.getCommandData().getArguments(), split)) throw new RequiredError('Missing parameters');
		else return { command, args: split };
	}

	/**
	 * Placeholder object
	 * @param {Message} msg Message to use in execution
	 */
	execute(msg) {
		log.warn(`No execution function defined for command ${this.parseArgs(msg).command}`);
	}

	/**
	 * Interceptor for command execution. Used for logging and other operations before command execution.
	 * It is async to be able to catch promise rejections from execute()
	 * @param {Message} msg Message to use in execution
	 */
	async superExec(msg) {
		try {
			const command = this.parseArgs(msg, true).command;
			const server = msg.guild, channel = msg.channel, author = msg.author;
			log.debug(`[COMMAND] >${command} ran in [${server.name}:${channel.name}] [${server.id}:${channel.id}] by @${author.tag}`);

			await this.execute(msg).catch((err) => { throw err; });
		} catch (err) {
			if (err.name === 'RequiredError') this.help(msg).catch((err) => handleError(msg, err));
			else handleError(msg, err);
		}
	}

	/**
	 * Reply to a poorly formatted command with a UsageEmbed
	 * @param {Message} msg Message to reply to
	 */
	help(msg) {
		return new Promise((resolve, reject) => {
			let args = this.getCommandData().getArguments() ? Object.keys(this.getCommandData().getArguments().args).map((key) => this.getCommandData().getArgument(key)) : [];

			return msg.channel.send(
				new UsageEmbed(
					this.command,
					' ',
					false,
					args.map((arg) => arg.getName()),
					args.map((arg) => buildHelpSections(`${arg.getDescription()} ${arg.getRequired() ? '(required)' : ''}`, this, msg.guild.id)),
					this.getCommandData().getNotes().map((note) => buildHelpSections(note, this, msg.guild.id))))
				.then((botMsg) => this.trash(msg, botMsg))
				.then(resolve)
				.catch(reject);
		});
	}

	/**
	 * Adds a trash can reaction to a message to let the user delete the bot/user messages
	 * @param {Message} userMsg The Message sent by the user
	 * @param {Message} botMsg The Message sent by the bot
	 * @param {boolean} deleteUser Wether or not to delete the user message
	 */
	trash(userMsg, botMsg, deleteUser = true) {
		trash(userMsg, botMsg, deleteUser);
	}

	//#region Setters

	/**
	 * Sets config data
	 * @param {Message} msg Used to get guild ID values
	 * @param {string} configType Type of config to set. Most commonly is "commands" or "settings"
	 * @param {string} setting Setting or Command to modifying
	 * @param {string} key Field being modified for setting or command
	 * @param {string} value Value to set key as
	 * @returns {string} Message to send to channel
	 */
	setConfig(msg, configType, setting, key, value) {
		let config = this.getConfig(msg.guild.id);

		if (configType === 'prefix') config.prefix = setting;
		else if (!(configType.startsWith('c') || configType.startsWith('s'))) return 'Not implemented';
		else {
			configType = configType.startsWith('c') ? 'commands' : 'settings';

			if (!config) return 'Error: no config';
			if (!config[configType]) config[configType] = {};
			if (!config[configType][setting]) config[configType][setting] = {};

			if (value === '-' || key === '-') {
				value === '-' ? config[configType][setting][key] = undefined : config[configType][setting] = undefined;
				config = JSON.parse(JSON.stringify(config));
			} else if (key === 'cooldown') {
				if (!config[configType][setting][key]) config[configType][setting][key] = {};
				config[configType][setting][key][msg.guild.id] = value;
			} else if (key === 'roles') {
				if (!config[configType][setting][key]) config[configType][setting][key] = [];
				value.startsWith('+')
					? config[configType][setting][key].push(value.replace('+', ''))
					: config[configType][setting][key].splice(config[configType][setting][key].indexOf(value.replace('-', '')), 1)
			} else {
				config[configType][setting][key] = value;
			}
		}

		let guildConfigPath = path.join(__dirname, `./config/servers/guild.${msg.guild.id}.json`);
		writeJson(guildConfigPath, config);
		return 'Config set';
	}

	//#endregion

	//#region Getters

	/**
	 * Return the server prefix, or default if not set
	 * @param {string} guildId Guild ID to get prefix for
	 * @returns {string} The guild or default prefix
	 */
	getPrefix(guildId) {
		return this.getConfig(guildId).prefix || '>';
	}

	/**
	 * Return this commands CommandData
	 * @returns {CommandData} CommandData for this command
	 */
	getCommandData() {
		return this.commandData;
	}

	/**
	 * Get the server or command config
	 * @param {string} guildId Discord server to get config for
	 * @param {boolean} [commandOnly=false] Only return config for the command
	 * @returns {Object} The server or command config
	 */
	getConfig(guildId, commandOnly = false) {
		return !commandOnly ? (this.config[guildId] || null) : this.config[guildId].commands[this.command] || null;
	}

	/**
	 * Get a variable value from either the config or the default
	 * @param {string} key Variable to get a value for
	 * @param {string=} guildId Use if you want the value from the config for specified guild
	 * @returns {*} Value of variable 'key'. Will be default if guild not set or if not specified in config
	 */
	getVariable(key, guildId = null) {
		if (guildId) {
			let command = this.getConfig(guildId).commands[this.command];
			return command && command[key] ? command[key] : this.getCommandData().getVariable(key);
		} else {
			return this.getCommandData().getVariable(key);
		}
	}

	//#endregion
}

module.exports = Command;

/**
 * 
 * @param {CommandArguments} args Arguments to check if any are required
 * @param {string[]} split The arguments passed to the command (@see parseArgs)
 */
function checkRequired(args, split) {
	return args ? args.getRequired() > split.length : false;
}

/**
 * Handle an error by printing in console and sending in Discord
 * @param {Message} msg Source message that caused an error
 * @param {Error} err The Error itself
 */
function handleError(msg, err) {
	log.warn(err);
	msg.channel.send(
		`\`\`\`js\n${err.stack || err.toString()}\`\`\`` +
		`Please alert an admin or \`@tycrek#0001\``
	)
		.then((botMsg) => trash(msg, botMsg))
		.catch((err) => log.warn(err));
}

function buildHelpSections(text, command, guildId) {
	if (!text.includes('{{{')) return text;

	text = text.replace(/\{\{\{prefix\}\}\}/g, command.getPrefix(guildId));
	let count = (text.match(/\{\{\{(.*?)\}\}\}/g) || []).length;

	for (let i = 0; i < count; i++) {
		let key = text.split('{{{')[1].split('}}}')[0];
		text = text.replace(`{{{${key}}}}`, command.getVariable(key, guildId));
	}

	return text;
}
