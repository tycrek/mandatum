const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
const { log, trash, filter, noPermission } = require('../utils');
const { prefix, owner, client } = require('../bot');
const UsageEmbed = require('../UsageEmbed');
const fetch = require('node-fetch');
const { google } = require('googleapis');

const YT = google.youtube({
	version: 'v3',
	auth: require('../auth.json').youtube
});
var queue = {};

module.exports = {
	vjoin: (msg) => {
		let vc = getVoice(msg);

		if (!isMemberVoice(msg))
			return msg.reply('Please join a voice channel first!').then((botMsg) => trash(msg, botMsg));
		if (vc)
			return msg.reply('Bot already in voice chat').then((botMsg) => trash(msg, botMsg));

		// Connect to users channel
		msg.member.voice.channel.join()
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

	vsearch: (msg) => {
		const emoji = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];

		let vc = getVoice(msg);

		if (!isMemberVoice(msg))
			return msg.reply('Please join a voice channel first!').then((botMsg) => trash(msg, botMsg));
		if (!vc)
			return msg.reply('Bot not in voice chat').then((botMsg) => trash(msg, botMsg));

		// youtube stuff
		let search = msg.content.slice(prefix.length).trim().split(/ +/).slice(1).join(' ').trim();

		if (search.length === 0 || search === '')
			return msg.reply('No search specified').then((botMsg) => trash(msg, botMsg));

		let results, botMsg;

		msg.channel.send(
			new MessageEmbed()
				.setTitle('Searching...'))
			.then((mBotMsg) => botMsg = mBotMsg)
			.then(() => YT.search.list({ q: search, part: 'snippet' }))
			.then((result) => {
				results = result.data.items;
				let count = 0;
				let embedText = results.map((result) => (count++, `**${count}**: \`[${result.snippet.channelTitle}] ${result.snippet.title}\`\n`));

				// returns promise but doesn't resolve until user clicks delete so don't listen for promise
				trash(msg, botMsg);

				return botMsg.edit(new MessageEmbed().setTitle('Results').setDescription(embedText));
			})
			.then(() => Promise.all(emoji.map((e) => botMsg.react(e))))
			.then(() => botMsg.awaitReactions((reaction, user) => emoji.includes(reaction.emoji.name) || reaction.emoji.name === '🗑️' && user.id === msg.author.id, { max: 1 }))
			.then((collected) => results[emoji.indexOf(collected.first()['_emoji'].name)])
			.then((video) => play(vc, ytdl(`https://www.youtube.com/watch?v=${video.id.videoId}`), msg.channel))
			.then(() => Promise.all([msg.delete(), botMsg.delete()]))
			.catch((err) => log.warn(err));
	},

	// vplay: (msg) => {

	// },

	vpause: (msg) => {
		let vc = getVoice(msg);

		if (!isMemberVoice(msg))
			return msg.reply('Please join a voice channel first!').then((botMsg) => trash(msg, botMsg));
		if (!vc)
			return msg.reply('Bot not in voice chat').then((botMsg) => trash(msg, botMsg));

		// pause stuff
		vc.dispatcher.pause();
	},

	vresume: (msg) => {
		let vc = getVoice(msg);

		if (!isMemberVoice(msg))
			return msg.reply('Please join a voice channel first!').then((botMsg) => trash(msg, botMsg));
		if (!vc)
			return msg.reply('Bot not in voice chat').then((botMsg) => trash(msg, botMsg));

		// pause stuff
		vc.dispatcher.resume();
	},

	// vvup: (msg) => {

	// },

	// vvdown: (msg) => {

	// }
}

function play(vc, item, channel) {
	if (!queue[vc.channel.id]) queue[vc.channel.id] = [];

	if (!vc.dispatcher) {
		let dispatcher = vc.play(item, { quality: 'highestaudio' });
		dispatcher.on('finish', () => queue[vc.channel.id].length > 0 && play(vc, queue[vc.channel.id].shift(), channel));

		let newMsg;
		channel.send(new MessageEmbed().setAuthor(`Now playing audio in ${vc.channel.name}`))
			.then((mNewMsg) => newMsg = mNewMsg)
			.then(() => Promise.all([newMsg.react('⏯'), newMsg.createReactionCollector((reaction, user) => reaction.emoji.name === '⏯' && user.id !== client.id)]))
			.then((results) =>
				results[1].on('collect', (reaction, user) => {
					vc.dispatcher.paused ? vc.dispatcher.resume() : vc.dispatcher.pause();
					newMsg.reactions.resolve(reaction).users.remove(user.id);
				}))
			.catch((err) => log.warn(err));
	} else {
		queue[vc.channel.id].push(item);

		let botMsg;
		channel.send(new MessageEmbed().setAuthor(`Added to queue (queue length: ${queue[vc.channel.id].length})`))
			.then((mBotMsg) => botMsg = mBotMsg)
			.then(() => botMsg.reactions.removeAll())
			.then(() => trash(null, botMsg, false))
			.catch((err) => log.warn(err));
	}
}

function isMemberVoice(msg) {
	return msg.member.voice.channel;
}

function getVoice(msg) {
	try { return client.voice.connections.find(connection => connection.channel.id === msg.member.voice.channel.id); }
	catch (err) { return false; }
}