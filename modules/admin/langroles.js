const Command = require('../../Command');

class LangRolesCommand extends Command {
	execute(msg) {
		const labelRole = {
			name: '⸻ LANGUAGES ⸻',
			color: '#2f3136'
		};

		const languages = [
			{ name: 'Angular', color: '#D82D30' },
			{ name: 'Assembly', color: '#1D282E' },
			{ name: 'Bootstrap', color: '#563D7C' },
			{ name: 'C', color: '#5D6CBF' },
			{ name: 'C#', color: '#9B4A96' },
			{ name: 'C++', color: '#649AD2' },
			{ name: 'CSS', color: '#3D9BD8' },
			{ name: 'Dart', color: '#2CB7F6' },
			{ name: 'Erlang', color: '#A90533' },
			{ name: 'Elixir', color: '#512034' },
			{ name: 'F#', color: '#378BBA' },
			{ name: 'Go', color: '#73CDDB' },
			{ name: 'Haskell', color: '#453A62' },
			{ name: 'HTML', color: '#EC631D' },
			{ name: 'Java', color: '#F89917' },
			{ name: 'JavaScript', color: '#F0D63B' },
			{ name: 'jQuery', color: '#0968AC' },
			{ name: 'Julia', color: '#252525' },
			{ name: 'Kotlin', color: '#DE6F64' },
			{ name: 'Less', color: '#244D84' },
			{ name: 'Lisp', color: '#FFFFFF' },
			{ name: 'Lua', color: '#01007E' },
			{ name: 'Nix', color: '#4F73BC' },
			{ name: 'Node.js', color: '#7BB740' },
			{ name: 'Objective-C', color: '#339BFF' },
			{ name: 'OCaml', Color: 'EC6C0D' },
			{ name: 'Perl', color: '#004065' },
			{ name: 'PHP', color: '#787CB4' },
			{ name: 'PowerShell', color: '#0274B9' },
			{ name: 'Pug.js', color: '#56332B' },
			{ name: 'Python', color: '#3471A2' },
			{ name: 'R', color: '#246ABF' },
			{ name: 'React', color: '#05CFF9' },
			{ name: 'Regex', color: '#64DD17' },
			{ name: 'Ruby', color: '#AD1300' },
			{ name: 'Rust', color: '#000000' },
			{ name: 'Sass', color: '#CC6699' },
			{ name: 'Scala', color: '#DE3423' },
			{ name: 'sh', color: '#293036' },
			{ name: 'Swift', color: '#FB4227' },
			{ name: 'SQL', color: '#318CC9' },
			{ name: 'TypeScript', color: '#007ACC' },
			{ name: 'V', color: '#5D87BF' },
			{ name: 'VBA', color: '#4477B9' },
			{ name: 'Vue', color: '#41B883' }
		];

		let settings = this.getConfig(msg.guild.id).settings;

		let labelPromise = !settings.langroles ? msg.guild.roles.create({ data: labelRole }) : new Promise((resolve) => resolve({ name: labelRole.name, id: settings.langroles.langroles[labelRole.name] }));

		return labelPromise
			.then((role) => Promise.all([role].concat(languages.map((language) =>
				!settings.langroles || !settings.langroles.langroles[language.name]
					? msg.guild.roles.create({ data: language })
					: new Promise((resolve) => resolve({ name: language.name, id: settings.langroles.langroles[language.name] }))))))
			.then((results) => {
				let saveData = {};
				results.forEach((result) => saveData[result.name] = result.id);
				return this.setConfig(msg, 'settings', 'langroles', 'langroles', saveData);
			})
			.then(() => msg.channel.send('Finished!'))
			.then((botMsg) => this.trash(msg, botMsg));
	}
}

module.exports = LangRolesCommand;
