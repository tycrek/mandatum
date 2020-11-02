const { CommandData, CommandVariable, CommandVariables, CommandArgument, CommandArguments } = require('../CommandData');
const commands = {
	//#region category test
	test: new (require('./test/test'))(
		new CommandData('test')
			.setCategory('admin')
			.setDescription('A test command')
			.setVariables(new CommandVariables()
				.addVariable(new CommandVariable('message', 'Hello bitch'))
				.addVariable(new CommandVariable('number', 55))))
		.loadConfig(),

	neoSetConfig: new (require('./test/neoSetConfig'))(
		new CommandData('neoSetConfig')
			.setCategory('admin')
			.setDescription('foo'))
		.loadConfig(),

	prefix: new (require('./test/prefix'))(
		new CommandData('prefix')
			.setCategory('admin')
			.setDescription('Set the server prefix'))
		.loadConfig(),

	noexectest: new (require('./test/noexectest'))(
		new CommandData('noexectest')
			.setCategory('admin')
			.setDescription('test'))
		.loadConfig(),

	bad: new (require('./test/bad'))(
		new CommandData('bad')
			.setCategory('admin')
			.setDescription('another test'))
		.loadConfig(),

	argtest: new (require('./test/argtest'))(
		new CommandData('argtest')
			.setCategory('admin')
			.setDescription('another test')
			.setVariables(new CommandVariables()
				.addVariable(new CommandVariable('length', 30))
				.addVariable(new CommandVariable('max', 50)))
			.setArguments(new CommandArguments()
				.addArgument(new CommandArgument('length', 'Length to expand character to', false, 'length'))
				.addArgument(new CommandArgument('character', 'Character to expand', true))))
		.loadConfig(),

	//#endregion

	//#region //* info
	help: new (require('./info/help'))(
		new CommandData('help')
			.setCategory('info')
			.setDescription('Displays all the commands')
			.setArguments(new CommandArguments()
				.addArgument(new CommandArgument('command', 'command to view help for'))))
		.loadConfig(),

	website: new (require('./info/website'))(
		new CommandData('website')
			.setCategory('info')
			.setDescription('Provide link to my website'))
		.loadConfig(),

	github: new (require('./info/github'))(
		new CommandData('github')
			.setCategory('info')
			.setDescription('Provide link to my GitHub'))
		.loadConfig(),

	source: new (require('./info/source'))(
		new CommandData('source')
			.setCategory('info')
			.setDescription('Provide link to Mandatum source code'))
		.loadConfig(),

	about: new (require('./info/about'))(
		new CommandData('about')
			.setCategory('info')
			.setDescription('Display info about Mandatum'))
		.loadConfig()

	//#endregion
};

module.exports = {
	getCommand: (command) => commands[command] ? commands[command] : null
};