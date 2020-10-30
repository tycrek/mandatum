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

	//#region Setters

	setConfig(msg, command, key, value) {
		let config = this.getConfig(msg.guild.id);

		if (!config) return false;
		if (!config.commands) config.commands = {};
		if (!config.commands[command]) config.commands[command] = {};

		if (value === '-') {
			config.commands[command][key] = undefined;
			config = JSON.parse(JSON.stringify(config));
		} else {
			config.commands[command][key] = value;
		}

		let guildConfigPath = path.join(__dirname, `./config/servers/guild.${msg.guild.id}.json`);
		writeJson(guildConfigPath, config);
		return true;
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
