const ytdl = require('ytdl-core');
const { log, trash, filter, noPermission } = require('../utils');
const { prefix, owner, client } = require('../bot');
const UsageEmbed = require('../UsageEmbed');
const fetch = require('node-fetch');

module.exports = {
	vjoin: (msg) => {
		let vc = getVoice(msg);

		if (!isMemberVoice(msg))
			return msg.reply('Please join a voice channel first!').then((botMsg) => trash(msg, botMsg));
		if (vc)
			return msg.reply('Bot already in voice chat').then((botMsg) => trash(msg, botMsg));

		// Connect to users channel
		msg.member.voice.channel.join()
			//.then((connection) => connection.play(args[1].includes('youtube') ? ytdl(args[1]) : args[1]))
			.then(() => msg.channel.send('Connected!'))
			.then((botMsg) => trash(msg, botMsg))
			.catch((err) => log.warn(err));
	},

	vleave: (msg) => {
		let vc = getVoice(msg);

		if (!isMemberVoice(msg))
			return msg.reply('Please join a voice channel first!').then((botMsg) => trash(msg, botMsg));
		if (!vc)
			return msg.reply('Bot not in voice chat').then((botMsg) => trash(msg, botMsg));

		// Disconnect from the channel
		vc.disconnect();

		msg.channel.send('Disconnected')
			.then((botMsg) => trash(msg, botMsg))
			.catch((err) => log.warn(err));
	},

	// vplay: (msg) => {

	// },

	// vpause: (msg) => {

	// },

	// vvup: (msg) => {

	// },

	// vvdown: (msg) => {

	// }
}

function isMemberVoice(msg) {
	return msg.member.voice.channel;
}

function getVoice(msg) {
	try { return client.voice.connections.find(connection => connection.channel.id === msg.member.voice.channel.id); }
	catch (err) { return false; }
}