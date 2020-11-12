class CommandData {
	/**
	 * Constructor for command data
	 * @param {string} command The command
	 */
	constructor(command) {
		this.command = command;
	}

	/**
	 * Note that will be shown in the UsageEmbed
	 * @param {string} note Note to add to the command
	 * @returns {Object} Self for chaining
	 */
	addNote(note) {
		if (!this.notes) this.notes = [];
		this.notes.push(note);
		return this;
	}

	//#region Setters

	/**
	 * Set command category
	 * @param {string} category Command category
	 * @returns {CommandData} Self for chaining
	 */
	setCategory(category) {
		this.category = category;
		return this;
	}

	/**
	 * Set command description
	 * @param {string} description Command description
	 * @returns {CommandData} Self for chaining
	 */
	setDescription(description) {
		this.description = description;
		return this;
	}

	/**
	 * Set the config variables this command uses
	 * @param {CommandVariables} variables Variables to read from the config
	 * @returns {CommandData} Self for chaining
	 */
	setVariables(variables) {
		this.variables = variables;
		return this;
	}

	/**
	 * Set the arguments this command accepts
	 * @param {CommandArguments} args Arguments for the command
	 * @returns {CommandData} Self for chaining
	 */
	setArguments(args) {
		this.args = args;
		return this;
	}

	//#endregion

	//#region Getters

	getCommandName() {
		return this.command;
	}

	getCategory() {
		return this.category;
	}

	getDescription() {
		return this.description;
	}

	getVariables() {
		return this.variables;
	}

	getArguments() {
		return this.args;
	}

	getVariable(key) {
		return this.variables.getVariable(key);
	}

	getArgument(key) {
		return this.args.getArgument(key);
	}

	getNotes() {
		return this.notes || [];
	}

	//#endregion
}

class CommandVariables {
	/**
	 * Variables for command
	 * @param {CommandVariable[]} [variables=null] CommandVariable's for command. If this is not used, addVariable must be used instead
	 */
	constructor(variables = null) {
		this.variables = {};
		variables && variables.length > 0 && variables.forEach((variable) => this.variables[variable.getName()] = variable.getDefaultValue());
	}

	/**
	 * Add a variable to this CommandVariables
	 * @param {CommandVariable} variable CommandVariable to add
	 * @returns {CommandVariables} Self for chaining
	 */
	addVariable(variable) {
		this.variables[variable.getName()] = variable.getDefaultValue();
		return this;
	}

	/**
	 * Get a CommandVariable
	 * @param {(string|null)} key Variable to return
	 * @returns {CommandVariable} CommandVariable for key
	 */
	getVariable(key) {
		return this.variables[key] || null;
	}
}

class CommandVariable {
	/**
	 * Creates a new CommandVariable
	 * @param {string} variable Variable name
	 * @param {*} defaultValue Default value to set for variable
	 */
	constructor(variable, defaultValue) {
		this.name = variable;
		this.defaultValue = defaultValue;
	}

	/**
	 * Get the variable name
	 * @returns {string} Variable name
	 */
	getName() {
		return this.name;
	}

	/**
	 * Get the default value for the variable
	 * @returns {*} Default value
	 */
	getDefaultValue() {
		return this.defaultValue;
	}
}

class CommandArguments {
	/**
	 * Arguments for command
	 * @param {CommandArgument[]} [args=null] Arguments for command
	 */
	constructor(args = null) {
		this.args = {};
		args && args.length > 0 && args.forEach((arg) => this.args[arg.getName()] = arg)
	}

	/**
	 * Add a new argument (alternative to constructor arguments)
	 * @param {CommandArgument} arg The CommandArgument to add
	 * @returns {CommandArguments} Self for chaining
	 */
	addArgument(arg) {
		this.args[arg.getName()] = arg;
		return this;
	}

	/**
	 * Get a CommandArgument
	 * @param {string} key Get the CommandArgument for key
	 * @returns {CommandArgument} The CommandArgument for key
	 */
	getArgument(key) {
		return this.args[key] || null;
	}

	/**
	 * Get the number of required CommandArgument's
	 * @returns {number} The number of required CommandArgument's
	 */
	getRequired() {
		let required = 0;
		Object.keys(this.args).forEach((arg) => this.getArgument(arg).getRequired() && required++)
		return required;
	}
}

class CommandArgument {
	/**
	 * 
	 * @param {string} name Name of the argument
	 * @param {string} description Description for the argument (used in UsageEmbed's)
	 * @param {boolean} required If this argument is required for command execution
	 * @param {string} variableKey Key for CommandVariable this argument relies on (typically a default value)
	 */
	constructor(name, description, required = false, variableKey = null) {
		this.name = name;
		this.description = description;
		this.required = required;
		this.variableKey = variableKey;
	}

	getName() {
		return this.name;
	}

	getDescription() {
		return this.description;
	}

	getRequired() {
		return this.required;
	}

	getVariableKey() {
		return this.variableKey;
	}
}

module.exports = {
	CommandData,
	CommandVariables,
	CommandVariable,
	CommandArguments,
	CommandArgument
};
