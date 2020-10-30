const { CommandData, CommandVariable, CommandVariables } = require('../CommandData');
const commands = {
	//#region category test
	test: new (require('./test/test'))(
		new CommandData('test')
			.setCategory('test')
			.setDescription('A test command')
			.setVariables(new CommandVariables()
				.addVariable(new CommandVariable('message', 'Hello bitch'))
				.addVariable(new CommandVariable('number', 55))))
		.loadConfig(),

	neoSetConfig: new (require('./test/neoSetConfig'))(
		new CommandData('neoSetConfig')
			.setCategory('admin')
			.setDescription('foo'))
		.loadConfig()
	//#endregion
};

module.exports = {
	getCommand: (command) => commands[command] ? commands[command] : null
};