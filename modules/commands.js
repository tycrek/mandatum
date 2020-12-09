const { CommandData, CommandVariable, CommandVariables, CommandArgument, CommandArguments } = require('../CommandData');

//#region //* Imports
//#region //* info
const HelpCommand = require('./info/help');
const AboutCommand = require('./info/about');
const SourceCommand = require('./info/source');
const WebsiteCommand = require('./info/website');
const GitHubCommand = require('./info/github');
//#endregion
//#region //* utility
const LinkCommand = require('./utility/link');
const UuidCommand = require('./utility/uuid');
const SearchCommand = require('./utility/search');
const UptimeCommand = require('./utility/uptime');
const RolesCommand = require('./utility/roles');
const RoleCommand = require('./utility/role');
//#endregion
//#region //* voice
const VJoinCommand = require('./voice/vjoin');
const VLeaveCommand = require('./voice/vleave');
const VSearchCommand = require('./voice/vsearch');
const VPauseCommand = require('./voice/vpause');
const VResumeCommand = require('./voice/vresume');
const VSkipCommand = require('./voice/vskip');
//#endregion
//#region //*fun
const NameMCCommand = require('./fun/namemc');
const BTCCommand = require('./fun/btc');
const MCSkinCommand = require('./fun/mcskin');
const ShutCommand = require('./fun/shut');
const InspireCommand = require('./fun/inspire');
const MemeCommand = require('./fun/meme');
const ConvertCommand = require('./fun/convert');
const UrbanCommand = require('./fun/urban');
const MorseCommand = require('./fun/morse');
const SchlongCommand = require('./fun/schlong');
const XdCommand = require('./fun/xd');
//#endregion
//#region //* moderator
const ClearCommand = require('./moderator/clear');
const KickCommand = require('./moderator/kick');
const DroleCommand = require('./moderator/drole');
const CroleCommand = require('./moderator/crole');
const StealCommand = require('./moderator/steal');
const VoteCommand = require('./moderator/vote');
const ColoursCommand = require('./moderator/colours');
//#endregion
//#region //* admin
const PrefixCommand = require('./admin/prefix');
const SetConfigCommand = require('./admin/setconfig');
const GetConfigCommand = require('./admin/getconfig');
const SendCommand = require('./admin/send');
const StatsCommand = require('./admin/stats');
const DelStatsCommand = require('./admin/delstats');
const LangRolesCommand = require('./admin/langroles');
const DelLangRolesCommand = require('./admin/dellangroles');
const RulesReactionCommand = require('./admin/rulesreaction');
//#endregion
//#endregion

//#region //* Commands
//#region //* info
const helpCommand = new HelpCommand(new CommandData('help')
	.setCategory('info')
	.setDescription('Displays all the commands')
	.setArguments(new CommandArguments()
		.addArgument(new CommandArgument('command', 'command to view help for'))))
	.loadConfig();
const aboutCommand = new AboutCommand(new CommandData('about')
	.setCategory('info')
	.setDescription('Display info about Mandatum'))
	.loadConfig();
const sourceCommand = new SourceCommand(new CommandData('source')
	.setCategory('info')
	.setDescription('Provide link to Mandatum source code'))
	.loadConfig();
const websiteCommand = new WebsiteCommand(new CommandData('website')
	.setCategory('info')
	.setDescription('Provide link to my website'))
	.loadConfig();
const githubCommand = new GitHubCommand(new CommandData('github')
	.setCategory('info')
	.setDescription('Provide link to my GitHub'))
	.loadConfig();
//#endregion
//#region //* utility
const linkCommand = new LinkCommand(new CommandData('link')
	.setCategory('utility')
	.setDescription('Creates a clickable link')
	.setArguments(new CommandArguments()
		.addArgument(new CommandArgument('url', 'URL to linkify (all this does is add https://)', true))))
	.loadConfig();
const uuidCommand = new UuidCommand(new CommandData('uuid')
	.setCategory('utility')
	.setDescription('Generate a new v4 UUID'))
	.loadConfig();
const searchCommand = new SearchCommand(new CommandData('search')
	.setCategory('utility')
	.setDescription('Search DuckDuckGo')
	.addNote('You can use [DuckDuckGo Bangs](https://duckduckgo.com/bang) to redirect your search')
	.setArguments(new CommandArguments()
		.addArgument(new CommandArgument('query', 'What to search for', true))))
	.loadConfig();
const uptimeCommand = new UptimeCommand(new CommandData('uptime')
	.setCategory('utility')
	.setDescription('Check the bot uptime'))
	.loadConfig();
const rolesCommand = new RolesCommand(new CommandData('roles')
	.setCategory('utility')
	.setDescription('Display available programming language roles')
	.addNote('Run `{{{prefix}}}role` to assign roles'))
	.loadConfig();
const roleCommand = new RoleCommand(new CommandData('role')
	.setCategory('utility')
	.setDescription('Apply programming roles to user')
	.setArguments(new CommandArguments()
		.addArgument(new CommandArgument('roles', 'Roles to apply, separated by space (case-insensitive). Up to 10 at a time', true)))
	.addNote('Run `{{{prefix}}}roles` to see available roles'))
	.loadConfig();
//#endregion
//#region //* voice
//#endregion
//#region //* fun
const nameMCCommand = new NameMCCommand(new CommandData('namemc')
	.setCategory('fun')
	.setDescription('Get a link to a NameMC profile')
	.setArguments(new CommandArguments()
		.addArgument(new CommandArgument('username', 'Minecraft username to get a link for from NameMC', true))))
	.loadConfig();
const btcCommand = new BTCCommand(new CommandData('btc')
	.setCategory('fun')
	.setDescription('Get the current price of Bitcoin')
	.setArguments(new CommandArguments()
		.addArgument(new CommandArgument('[currency]/bal', 'Specific currency to see the current price of Bitcoin, or `bal` to check a wallet balance', false))
		.addArgument(new CommandArgument('address', 'Address to check when using `bal` mode. This is NOT required for a simple value check.', false))
		.addArgument(new CommandArgument('currency', 'Used to check a specific currency when using `bal` mode.', false))))
	.loadConfig();
const mcskinCommand = new MCSkinCommand(new CommandData('mcskin')
	.setCategory('fun')
	.setDescription('Show a Minecraft user skin')
	.setArguments(new CommandArguments()
		.addArgument(new CommandArgument('username', 'Minecraft username to display a skin for', true))))
	.loadConfig();
const shutCommand = new ShutCommand(new CommandData('shut')
	.setCategory('fun')
	.setDescription('Shut up'))
	.loadConfig();
const inspireCommand = new InspireCommand(new CommandData('inspire')
	.setCategory('fun')
	.setDescription('Be inspired'))
	.loadConfig();
const memeCommand = new MemeCommand(new CommandData('meme')
	.setCategory('fun')
	.setDescription('Show a random meme from imgflip.com'))
	.loadConfig();
const convertCommand = new ConvertCommand(new CommandData('convert')
	.setCategory('fun')
	.setDescription('Converts units')
	.setArguments(new CommandArguments()
		.addArgument(new CommandArgument('unit', 'Unit to convert', true))
		.addArgument(new CommandArgument('value', 'Value to convert', true)))
	.addNote('Currently only temperature is supported. Example: `convert temp 15c`'))
	.loadConfig();
const urbanCommand = new UrbanCommand(new CommandData('urban')
	.setCategory('fun')
	.setDescription('Show a random definition from Urban Dictionary'))
	.loadConfig();
const morseCommand = new MorseCommand(new CommandData('morse')
	.setCategory('fun')
	.setDescription('Convert text into morse code')
	.setVariables(new CommandVariables()
		.addVariable(new CommandVariable('max', 30)))
	.setArguments(new CommandArguments()
		.addArgument(new CommandArgument('text', 'String of words to convert to morse code', true)))
	.addNote('Limited to length `{{{max}}}`. Can be changed with the `max` variable.'))
	.loadConfig();
const schlongCommand = new SchlongCommand(new CommandData('schlong')
	.setCategory('fun')
	.setDescription('...')
	.setVariables(new CommandVariables()
		.addVariable(new CommandVariable('max', 30)))
	.setArguments(new CommandArguments()
		.addArgument(new CommandArgument('length', 'Length of the schlong', true)))
	.addNote('Limited to length `{{{max}}}`. Can be changed with the `max` variable.'))
	.loadConfig();
const xdCommand = new XdCommand(new CommandData('xd')
	.setCategory('fun')
	.setDescription('Prints "xd" or "XD" to `length`')
	.setVariables(new CommandVariables()
		.addVariable(new CommandVariable('max', 30)))
	.setArguments(new CommandArguments()
		.addArgument(new CommandArgument('length', 'Length of the xd/XD', true)))
	.addNote('Limited to length `{{{max}}}`. Can be changed with the `max` variable.'))
	.loadConfig();
//#endregion
//#region //* moderator
const clearCommand = new ClearCommand(new CommandData('clear')
	.setCategory('moderator')
	.setDescription('Bulk delete messages')
	.setArguments(new CommandArguments()
		.addArgument(new CommandArgument('amount', 'Number of messages to delete', true)))
	.addNote('This command may take a while to run due to Discord rate limiting'))
	.loadConfig();
const kickCommand = new KickCommand(new CommandData('kick')
	.setCategory('moderator')
	.setDescription('Kick a user from the server')
	.setArguments(new CommandArguments()
		.addArgument(new CommandArgument('@user', 'User to kick', true))
		.addArgument(new CommandArgument('reason', 'Reason for kick', true))))
	.loadConfig();
const droleCommand = new DroleCommand(new CommandData('drole')
	.setCategory('moderator')
	.setDescription('Delete a role')
	.setArguments(new CommandArguments()
		.addArgument(new CommandArgument('@role', 'Role to delete', true))))
	.loadConfig();
const croleCommand = new CroleCommand(new CommandData('crole')
	.setCategory('moderator')
	.setDescription('Create a role')
	.setArguments(new CommandArguments()
		.addArgument(new CommandArgument('"name"', 'Role name (can have spaces)', true))
		.addArgument(new CommandArgument('"color"', 'Must be a [ColorResolvable](https://discord.js.org/#/docs/main/stable/typedef/ColorResolvable)', true))
		.addArgument(new CommandArgument('"permissions"', 'Must be `NONE` or a [PermissionResolvable](https://discord.js.org/#/docs/main/stable/typedef/PermissionResolvable)', true))
		.addArgument(new CommandArgument('"mentionable"', 'Whether or not the role can be mentioned by any users. Must be either `true` or `false`', true)))
	.addNote('All parameters must be contained within "quotes"'))
	.loadConfig();
const stealCommand = new StealCommand(new CommandData('steal')
	.setCategory('moderator')
	.setDescription('Steal emojis from other servers (Nitro required)')
	.setArguments(new CommandArguments()
		.addArgument(new CommandArgument('emojis', 'Emojis to steal, separated by space', true)))
	.addNote('Due to Discord rate limiting, only 5 emoji can be added at a time')
	.addNote(
		'If you do not have access to the server an emoji is from (another Nitro user used it), you can use any of the following format formats:' + '\n' +
		'`  {{{prefix}}}steal emojiname:https://cdn.discord.com/emojis/......`' + '\n' +
		'`  {{{prefix}}}steal :emojiname:emojiID`' + '\n' +
		'`  {{{prefix}}}steal a:emojiname:emojiID` (used for animated emoji)'
	))
	.loadConfig();
const voteCommand = new VoteCommand(new CommandData('vote')
	.setCategory('moderator')
	.setDescription('Vote on a topic using 👍 and 👎')
	.setArguments(new CommandArguments()
		.addArgument(new CommandArgument('time', 'Time in seconds to run vote for', true))
		.addArgument(new CommandArgument('topic', 'Topic to vote on', true))))
	.loadConfig();
const coloursCommand = new ColoursCommand(new CommandData('colours')
	.setCategory('moderator')
	.setDescription('Display available colours Discord supports (not including hex values)'))
	.loadConfig();
//#endregion
//#region //* admin
const prefixCommand = new PrefixCommand(new CommandData('prefix')
	.setCategory('admin')
	.setDescription('Change the bot prefix for this server')
	.setArguments(new CommandArguments()
		.addArgument(new CommandArgument('prefix', 'Prefix to use for this server', false)))
	.addNote('Leaving `prefix` blank will set it to the global bot default: `>`'))
	.loadConfig();
const setConfigCommand = new SetConfigCommand(new CommandData('setconfig')
	.setCategory('admin')
	.setDescription('Sets a value in the server config file')
	.setArguments(new CommandArguments()
		.addArgument(new CommandArgument('section', 'Section of the config to edit. Either `settings` or `commands`', true))
		.addArgument(new CommandArgument('setting', 'Item in `section` to set a value for', true))
		.addArgument(new CommandArgument('key', 'Key to set a value for', true))
		.addArgument(new CommandArgument('value', 'Value to set for `key` in `setting`', true)))
	.addNote('`s` and `c` can be used in place of `settings` and `commands`')
	.addNote('To remove something from the config, use `-` in place of either `value` or `key`'))
	.loadConfig();
const getConfigCommand = new GetConfigCommand(new CommandData('getconfig')
	.setCategory('admin')
	.setDescription('Get the server config')
	.setArguments(new CommandArguments()
		.addArgument(new CommandArgument('section', 'Section of the config to retrieve', false))
		.addArgument(new CommandArgument('setting', 'Setting in `section` to retrieve', false))
		.addArgument(new CommandArgument('key', 'Key to retrieve', false)))
	.addNote('Any of these arguments may be omitted'))
	.loadConfig();
const sendCommand = new SendCommand(new CommandData('send')
	.setCategory('admin')
	.setDescription('Send a certain number of messages (useful for testing auto deletion or spam detection')
	.setArguments(new CommandArguments()
		.addArgument(new CommandArgument('count', 'Number of messages to send', true)))
	.addNote('Messages may only appear to send 5 at a time; this is due to Discord rate limiting and is unavoidable'))
	.loadConfig();
const statsCommand = new StatsCommand(new CommandData('stats')
	.setCategory('admin')
	.setDescription('Create locked "voice" channels to view server stats such as Member count, Bot count, and server creation date')
	.setArguments(new CommandArguments()
		.addArgument(new CommandArgument('category-name', 'Title of the category for the stats channels', true)))
	.addNote('Spaces are permitted in `category-name`'))
	.loadConfig();
const delStatsCommand = new DelStatsCommand(new CommandData('delstats')
	.setCategory('admin')
	.setDescription('Delete the stats channels'))
	.loadConfig();
const langRolesCommand = new LangRolesCommand(new CommandData('langroles')
	.setCategory('admin')
	.setDescription('Creates programming languages roles for the server'))
	.loadConfig();
const delLangRolesCommand = new DelLangRolesCommand(new CommandData('dellangroles')
	.setCategory('admin')
	.setDescription('Deletes programming languages roles'))
	.loadConfig();
const rulesReactionCommand = new RulesReactionCommand(new CommandData('rulesreaction')
	.setCategory('admin')
	.setDescription('React to a message to confirm a user read the rules')
	.setArguments(new CommandArguments()
		.addArgument(new CommandArgument('@role', 'Role to assign', true))))
	.loadConfig();
//#endregion
//#endregion

const commands = {
	//#region //*category test
	/* test: new (require('./test/test'))(
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
		.loadConfig(), */

	//#endregion

	//#region //* info
	help: helpCommand,
	website: websiteCommand,
	github: githubCommand,
	source: sourceCommand,
	about: aboutCommand,
	//#endregion

	//#region //* utility
	link: linkCommand,
	uuid: uuidCommand,
	search: searchCommand,
	uptime: uptimeCommand,
	roles: rolesCommand,
	role: roleCommand,
	//#endregion

	//#region //* voice
	//#endregion

	//#region //* fun
	namemc: nameMCCommand,
	btc: btcCommand,
	mcskin: mcskinCommand,
	shut: shutCommand,
	inspire: inspireCommand,
	meme: memeCommand,
	convert: convertCommand,
	urban: urbanCommand,
	morse: morseCommand,
	schlong: schlongCommand,
	xd: xdCommand,
	XD: xdCommand,
	//#endregion

	//#region //* moderator
	clear: clearCommand,
	kick: kickCommand,
	drole: droleCommand,
	crole: croleCommand,
	steal: stealCommand,
	vote: voteCommand,
	colours: coloursCommand,
	colors: coloursCommand,
	//#endregion

	//#region //* admin
	prefix: prefixCommand,
	setconfig: setConfigCommand,
	getconfig: getConfigCommand,
	send: sendCommand,
	stats: statsCommand,
	delstats: delStatsCommand,
	langroles: langRolesCommand,
	dellangroles: delLangRolesCommand,
	rulesreaction: rulesReactionCommand
	//#endregion
};

const categories = ['info', 'utility', 'fun', 'moderator', 'admin'];

module.exports = {
	getCategories: () => categories,
	getCommand: (command) => commands[command] ? commands[command] : null,
	getCommands: (category) => categories.includes(category) ? Object.keys(commands).filter((command) => commands[command].getCommandData().getCategory() === category).map((commandKey) => commands[commandKey]) : null
};
