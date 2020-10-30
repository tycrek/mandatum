const path = require('path');
const fs = require('fs-extra');
const UsageEmbed = require('./UsageEmbed');
const { CommandData, CommandVariables, CommandVariable } = require('./CommandData');
const { readJson, writeJson } = require('./utils');

class Command {

	/**
	 * 
	 * @param {CommandData} commandData 
	 */
	constructor(commandData) {
		this.command = commandData.getCommandName();
		this.commandData = commandData;
	}

	loadConfig() {
		let guilds = require('./config/guilds.json').guilds;
		this.config = {};
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

	parseArgs(msg) {
		let prefix = this.getConfig(msg.guild.id).prefix || '>';
		let split = msg.content.slice(prefix.length).trim().split(/ +/);
		return { command: split.shift(), args: split };
	}

	//#region Setters

	setConfig(msg, configType, setting, key, value) {
		let config = this.getConfig(msg.guild.id);

		if (!(configType.startsWith('c') || configType.startsWith('s'))) return 'Not implemented';

		configType = configType.startsWith('c') ? 'commands' : 'settings';

		if (!config) return 'Error: no config';
		if (!config[configType]) config[configType] = {};
		if (!config[configType][setting]) config[configType][setting] = {};

		if (value === '-' || key === '-') {
			value === '-' ? config[configType][setting][key] = undefined : config[configType][setting] = undefined;
			config = JSON.parse(JSON.stringify(config));
		} else {
			config[configType][setting][key] = value;
		}

		let guildConfigPath = path.join(__dirname, `./config/servers/guild.${msg.guild.id}.json`);
		writeJson(guildConfigPath, config);
		return 'Config set';
	}

	//#endregion

	//#region Getters

	getCategory() {
		return this.commandData.category;
	}

	getConfig(guildId, commandOnly = false) {
		return !commandOnly ? (this.config[guildId] || null) : this.config[guildId].commands[this.command] || null;
	}

	/**
	 * 
	 * @param {String} key 
	 * @param {String} guildId Use if you want the value from the config
	 */
	getVariable(key, guildId = null) {
		if (guildId) {
			let command = this.getConfig(guildId).commands[this.command];
			return command && command[key] ? command[key] : this.commandData.getVariable(key);
		} else {
			return this.commandData.getVariable(key);
		}
	}

	//#endregion
}

module.exports = Command;
