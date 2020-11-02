class CommandData {
	/**
	 * Constructor for command data
	 * @param {String} command The command
	 */
	constructor(command) {
		this.command = command;
	}

	//#region Setters

	/**
	 * Set command category
	 * @param {String} category Command category
	 */
	setCategory(category) {
		this.category = category;
		return this;
	}

	/**
	 * Set command description
	 * @param {String} description Command description
	 */
	setDescription(description) {
		this.description = description;
		return this;
	}

	/**
	 * Set the config variables this command uses
	 * @param {CommandVariables} variables Variables to read from the config
	 */
	setVariables(variables) {
		this.variables = variables;
		return this;
	}

	//#endregion

	//#region Getters

	getCommandName() {
		return this.command;
	}

	getVariable(key) {
		return this.variables.getVariable(key);
	}

	//#endregion
}

class CommandVariables {
	/**
	 * 
	 * @param {CommandVariable[]} variables 
	 */
	constructor(variables = null) {
		this.variables = {};
		variables && variables.length > 0 && variables.forEach((variable) => this.variables[variable.getName()] = variable.getDefaultValue());
	}

	/**
	 * 
	 * @param {CommandVariable} variable 
	 */
	addVariable(variable) {
		this.variables[variable.getName()] = variable.getDefaultValue();
		return this;
	}

	getVariable(key) {
		return this.variables[key] || null;
	}
}

class CommandVariable {
	constructor(variable, defaultValue) {
		this.name = variable;
		this.defaultValue = defaultValue;
	}

	getName() {
		return this.name;
	}

	getDefaultValue() {
		return this.defaultValue;
	}
}

module.exports = {
	CommandData,
	CommandVariables,
	CommandVariable
};
