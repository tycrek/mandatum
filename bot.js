const fs = require('fs-extra');
const { Client, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

const client = new Client();
client.once('ready', () => console.log('Ready!'));

const prefix = '>';
const commands = {
	commands: (msg) => mCommands(msg),
	website: (msg) => website(msg),
	github: (msg) => github(msg),
	namemc: (msg) => namemc(msg),
	btc: (msg) => btc(msg),
	mcskin: (msg) => mcskin(msg),
	source: (msg) => source(msg)
};

for (let command in commands)
	client.on('message', (msg) => msg.content.trim().split(/ +/)[0] === `${prefix}${command}` && commands[command](msg));

client.login(fs.readJsonSync(require('path').join(__dirname, 'auth.json')).token);

function mCommands(msg) {
	let text = '';
	for (let command in commands) text = `${text}\`>${command}\`\n`;

	let embed = new MessageEmbed()
		.setTitle('Bot commands')
		.setColor(0xFFFF00)
		.setDescription(text);
	msg.channel.send(embed);
}

function website(msg) {
	msg.channel.send('Visit: https://jmoore.dev/');
	msg.delete();
}

function github(msg) {
	msg.channel.send('Visit: https://github.com/tycrek');
	msg.delete();
}

function namemc(msg) {
	const args = msg.content.slice(prefix.length).trim().split(/ +/);
	msg.channel.send(`https://namemc.com/s?${args[1]}`)
}

function btc(msg) {
	fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
		.then((res) => res.json())
		.then((json) => json.bpi.USD.rate)
		.then((price) => new MessageEmbed()
			.setTitle('Current Bitcoin Price (USD)')
			.setColor(0xF79019)
			.setDescription(`$${price}`))
		.then((embed) => msg.channel.send(embed));
}

function mcskin(msg) {
	const args = msg.content.slice(prefix.length).trim().split(/ +/);
	let embed = new MessageEmbed()
		.setTitle(`${args[1]}'s Minecraft skin`)
		.setColor(0xFF4136)
		.setImage(`https://minotar.net/armor/body/${args[1]}/150.png`);
	msg.channel.send(embed);
}

function mcskin(msg) {
	let embed = new MessageEmbed()
		.setTitle(`Bot source code`)
		.setColor(0x181A1B)
		.setImage(`https://github.com/tycrek/mandatum`);
	msg.channel.send(embed);
}