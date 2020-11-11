const CATEGORY = 'admin';

/* Imports */
const { MessageEmbed } = require('discord.js');
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');
const { log, trash, filter, noPermission, Command } = require('../utils');
const { prefix, owner } = require('../bot');
const UsageEmbed = require('../UsageEmbed');
const TycrekCert = require('tycrek-certs-custom');

// export command functions
module.exports = {

	/* getconfig: new Command(CATEGORY, null, (cmd, msg) => {
		const args = msg.content.slice(prefix.length).trim().split(/ +/);
		args.shift();

		cmd.getConfig(msg, args)
			.then((result) => msg.channel.send(`\`\`\`json\n${JSON.stringify(result, null, 2)}\`\`\``))
			.then((botMsg) => trash(msg, botMsg));
	}), */

	/* setconfig: new Command(CATEGORY, null, (cmd, msg) => {
		const args = msg.content.slice(prefix.length).trim().split(/ +/);
		args.shift();

		cmd.setConfig(msg, args)
			.then((result) => msg.channel.send(result))
			.then((botMsg) => trash(msg, botMsg));
	}), */

	/* release: new Command(CATEGORY, null, (cmd, msg) => {
		if (!filter.author(msg, owner)) return noPermission(msg);
		const args = msg.content.slice(prefix.length).trim().split(/ +/);
		let project = args[1];
		let version = args[2];
		let change = args[3];
		let fix = args[4];

		let changeText = change.split('##').join('\n- ');
		let fixText = fix.split('##').join('\n- ');

		let embed = new MessageEmbed()
			.setColor(0x03A9F4)
			.setThumbnail('https://raw.githubusercontent.com/tycrek/jmoore.dev/master/client/images/profile/profile-normal-small.jpg')
			.setTitle(`${project} v${version}`)
			.addFields(
				{ name: 'Changes', value: changeText, inline: true },
				{ name: '\u200B', value: '\u200B', inline: true },
				{ name: 'Fixed', value: fixText, inline: true },
			);

		msg.channel.send(embed)
			.catch((err) => log.warn(err));
	}), */

	/* send: new Command(CATEGORY, new UsageEmbed('send', '', false, ['count'], ['How many messages to send']), (cmd, msg) => {
		const args = msg.content.slice(prefix.length).trim().split(/ +/);
		let count = parseInt(args[1]);

		if (!count || count < 1)
			return cmd.help(msg);

		log.info(`Sending ${count} messages to channel ${msg.channel.name} in ${msg.guild.name}`);
		msg.delete().catch((err) => log.warn(err));

		// Generate our message objects and populate the array
		let messages = [];
		for (let i = 0; i < count; i++)
			messages.push(() =>
				new Promise((resolve) =>

					// Send the message
					msg.channel.send(`**Automessage in progress...** (${i + 1}/${count})`)

						// Recursively call the next message event after sending
						.then(() => messages[i + 1]())

						// Previous line will eventually return itself as a promise
						.then(() => resolve())

						// The last message has an error at [i + 1] so we can exploit this as our exit condition
						.catch(() => resolve())));

		// Call the first message in the batch to kick off the loop
		messages[0]()
			.then(() => log.info(`Completed sending ${count} messages to channel ${msg.channel.name} in ${msg.guild.name}`))
			.then(() => msg.member.createDM())
			.then((channel) => channel.send(`**${count}** messages created!`))
			.catch((err) => log.warn(err));
	}), */

	stats: new Command(CATEGORY, null, (cmd, msg) => {
		const args = msg.content.slice(prefix.length).trim().split(/ +/);
		let command = args.shift();
		let category = args.join('-');

		let age = msg.guild.createdTimestamp;
		let everyone = msg.guild.roles.everyone.id;
		let configPath = path.join(__dirname, `../config/servers/guild.${msg.guild.id}.json`);

		let memberCount = bots = 0;
		msg.guild.members.fetch()
			.then((members) => members.each((member) => member.user.bot ? bots++ : memberCount++))
			.then(() => msg.guild.channels.create(category, { type: 'category' }))
			.then((c) => c.setPosition(0))
			.then((c) => Promise.all([
				fs.readJson(configPath),
				c.id,
				c.guild.channels.create(`Members: ${memberCount}`, { type: 'voice', parent: c.id, permissionOverwrites: [{ id: everyone, deny: 1048576 }, { id: require('../bot').client.user.id, allow: 1048592 }] }),
				c.guild.channels.create(`Bots: ${bots}`, { type: 'voice', parent: c.id, permissionOverwrites: [{ id: everyone, deny: 1048576 }, { id: require('../bot').client.user.id, allow: 1048592 }] }),
				c.guild.channels.create(`Created: ${moment(age).format('MMM Do YYYY')}`, { type: 'voice', parent: c.id, permissionOverwrites: [{ id: everyone, deny: 1048576 }, { id: require('../bot').client.user.id, allow: 1048592 }] }),
			]))
			.then((results) => {
				let config = results[0];
				config.stats = {
					parent: results[1],
					members: results[2].id,
					bots: results[3].id,
					age: results[4].id
				};
				return config;
			})
			.then((config) => fs.writeJson(configPath, config, { spaces: '\t' }))
			.then(() => msg.channel.send('Stats channels created successfully.'))
			.then((botMsg) => trash(msg, botMsg))
			.catch((err) => log.warn(err));
	}),

	delstats: new Command(CATEGORY, null, (cmd, msg) => {
		let configPath = path.join(__dirname, `../config/servers/guild.${msg.guild.id}.json`);

		let config;
		fs.readJson(configPath)
			.then((mConfig) => config = mConfig)
			.then(() => { if (!config.stats) throw Error('No stats data in config') })
			.then(() => msg.guild.channels)
			.then((channels) => Promise.all([channels.resolve(config.stats.parent), channels.resolve(config.stats.members), channels.resolve(config.stats.bots), channels.resolve(config.stats.age)]))
			.then((stats) => Promise.all(stats.map((statChannel) => statChannel.delete())))
			.then((_results) => msg.channel.send('Deleted stats channels'))
			.then((botMsg) => trash(msg, botMsg))
			.catch((err) => log.warn(err));
	}),

	/* 'jmdev:certs': new Command(CATEGORY, null, (cmd, msg) => {
		if (!filter.author(msg, owner)) return noPermission(msg);

		let testing = require('os').hostname() !== 'ubuntu-s-1vcpu-1gb-tor1-01';
		if (testing) log.warn('Certificates command called in testing environment, I hope you know what you are doing!');

		msg.channel.send('Generating certificates, please wait')
			.then((botMsg) => {
				let cert = new TycrekCert(require('../auth.json').digitalocean, ['*.jmoore.dev', 'jmoore.dev'], 'josh.moore@jmoore.dev', 'josh.moore@jmoore.dev', testing);
				cert.setSavePath('/certs');
				return Promise.all([getCert(cert), botMsg]);
			})
			.then((results) => results[1].edit('Completed!'))
			.then((botMsg) => trash(msg, botMsg))
			.catch((err) => log.warn(err));

		async function getCert(c) {
			await c.init();
			await c.account();
			await c.createCertificate();
		}
	}),

	record: new Command(CATEGORY, new UsageEmbed('record', ' ', false, ['user', 'record', 'value', 'screenshotUrl', 'mcusername', 'colour'], ['Discord username', 'What record got broken (deaths, block mined, etc). Use hyphens to indicate a space.', 'Numerical value of the record', 'URL to the screenshot for proof', 'Minecraft username for skin', 'Colour for Embed accent (use >colours to see available colours)']), (cmd, msg) => {
		if (!filter.author(msg, owner)) return noPermission(msg);
		const args = msg.content.slice(prefix.length).trim().split(/ +/);
		let command = args.shift();

		if (args.length < 5)
			return cmd.help(msg);

		let discordUser = args[0];
		let record = args[1];
		let value = args[2].replace(/[a-zA-Z]/g, '');
		let units = args[2].replace(/[0-9]/g, '');
		let screenshot = args[3];
		let mcusername = args[4];
		let colour = args[5];

		msg.channel.send(
			new MessageEmbed()
				.setTitle(`${record.replace(/\-/g, ' ')}`)
				.setImage(screenshot)
				.setColor(colour)
				.addField('Record', numberWithCommas(value) + units, true)
				.addField('Set by', `${discordUser} (${mcusername})`, true)
		)
			//.then((botMsg) => msg.delete())
			.catch((err) => log.warn(err));

		function numberWithCommas(x) {
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
	}), */

	langroles: new Command(CATEGORY, null, (cmd, msg) => {
		const labelRole = {
			name: '⸻ LANGUAGES ⸻',
			color: '#2f3136'
		};

		const languages = [
			{ name: 'Angular', color: '#D82D30' },
			{ name: 'Assembly', color: '#1D282E' },
			{ name: 'C', color: '#5D6CBF' },
			{ name: 'C#', color: '#9B4A96' },
			{ name: 'C++', color: '#649AD2' },
			{ name: 'CSS', color: '#3D9BD8' },
			{ name: 'Dart', color: '#2CB7F6' },
			{ name: 'Go', color: '#73CDDB' },
			{ name: 'Haskell', color: '#453A62' },
			{ name: 'HTML', color: '#EC631D' },
			{ name: 'Java', color: '#F89917' },
			{ name: 'JavaScript', color: '#F0D63B' },
			{ name: 'Julia', color: '#252525' },
			{ name: 'Kotlin', color: '#DE6F64' },
			{ name: 'Less', color: '#244D84' },
			{ name: 'Lua', color: '#01007E' },
			{ name: 'Node.js', color: '#7BB740' },
			{ name: 'Objective-C', color: '#339BFF' },
			{ name: 'Perl', color: '#004065' },
			{ name: 'PHP', color: '#787CB4' },
			{ name: 'Python', color: '#3471A2' },
			{ name: 'R', color: '#246ABF' },
			{ name: 'React', color: '#05CFF9' },
			{ name: 'Ruby', color: '#AD1300' },
			{ name: 'Rust', color: '#000000' },
			{ name: 'Sass', color: '#CC6699' },
			{ name: 'Scala', color: '#DE3423' },
			{ name: 'Swift', color: '#FB4227' },
			{ name: 'SQL', color: '#318CC9' },
			{ name: 'TypeScript', color: '#007ACC' },
			{ name: 'VBA', color: '#4477B9' },
			{ name: 'Vue', color: '#41B883' }
		];

		msg.guild.roles.create({ data: labelRole })
			.then((role) => Promise.all([role].concat(languages.map((language) => msg.guild.roles.create({ data: language })))))
			.then((results) => {
				let saveData = {};
				results.forEach((result) => saveData[result.name] = result.id);
				return cmd.setConfig(msg, ['settings', 'langroles', 'langroles', saveData]);
			})
			.then(() => msg.channel.send('Finished!'))
			.then((botMsg) => trash(msg, botMsg))
			.catch((err) => log.warn(err));
	}),

	dellangroles: new Command(CATEGORY, null, (cmd, msg) => {
		cmd.getConfig(msg, ['settings', 'langroles', 'langroles'])
			.then((config) => Promise.all(Object.keys(config).map((roleData) => msg.guild.roles.fetch(config[roleData]))))
			.then((roles) => Promise.all(roles.map((role) => role.delete())))
			.then(() => cmd.setConfig(msg, ['settings', 'langroles', '-']))
			.then((_results) => msg.channel.send('Deleted language roles'))
			.then((botMsg) => trash(msg, botMsg))
			.catch((err) => log.warn(err));
	})
}
