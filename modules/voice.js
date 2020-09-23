const CATEGORY = 'voice';

const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core-discord');
const { log, trash, Command } = require('../utils');
const { prefix, client } = require('../bot');
const UsageEmbed = require('../UsageEmbed');
const youtube = require('scrape-youtube').default

var queue = {};

module.exports = {
	vjoin: new Command(CATEGORY, null, (cmd, msg) => {
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
	}),

	vleave: new Command(CATEGORY, null, (cmd, msg) => {
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
	}),

	vsearch: new Command(CATEGORY, null, (cmd, msg) => {
		const emoji = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];

		let vc = getVoice(msg), results, botMsg;

		if (!isMemberVoice(msg))
			return msg.reply('Please join a voice channel first!').then((botMsg) => trash(msg, botMsg));
		if (!vc)
			return msg.reply('Bot not in voice chat').then((botMsg) => trash(msg, botMsg));

		// Search query
		let search = msg.content.slice(prefix.length).trim().split(/ +/).slice(1).join(' ').trim();

		if (search.length === 0 || search === '')
			return msg.reply('No search specified').then((botMsg) => trash(msg, botMsg));

		msg.channel.send(new MessageEmbed().setTitle('Searching...'))
			.then((mBotMsg) => botMsg = mBotMsg)

			// Search youtube
			.then(() => youtube.search(search, { limit: 5 }))
			.then((res) => res.slice(0, 5))
			.then((sliced) => results = sliced)
			.then(() => {
				// Returns promise but doesn't resolve until user clicks delete so don't listen for promise // ! don't put in a .then()
				trash(msg, botMsg);

				// Build results message
				let count = 0;
				return botMsg.edit(
					new MessageEmbed().setTitle('Results').setDescription(
						results.map((result) =>
							(count++, `**${count}**: \`[${result.channel.name}] ${result.title}\`\n`))));
			})

			// Add reactions to message and wait for results
			.then(() => Promise.all(emoji.map((e) => botMsg.react(e))))
			.then(() => botMsg.awaitReactions((reaction, user) => emoji.includes(reaction.emoji.name) || reaction.emoji.name === '🗑️' && user.id === msg.author.id, { max: 1 }))
			.then((collected) => results[emoji.indexOf(collected.first()['_emoji'].name)])

			// I don't like using async but ytdl-core-discord needs async so whatever
			.then((video) => _play(vc, video.link, msg.channel))

			// Don't need the calling messages anymore
			.then(() => Promise.all([msg.delete()]))
			.then(() => botMsg.delete())
			.catch((err) => log.warn(err));

		// ytdl-core-discord specifically requires an async funtion so I need a wrapper
		async function _play(vc, link, channel) {
			play(vc, await ytdl(link), channel);
		}
	}),

	// vplay: (msg) => {

	// },

	vpause: new Command(CATEGORY, null, (cmd, msg) => {
		let vc = getVoice(msg);

		if (!isMemberVoice(msg))
			return msg.reply('Please join a voice channel first!').then((botMsg) => trash(msg, botMsg));
		if (!vc)
			return msg.reply('Bot not in voice chat').then((botMsg) => trash(msg, botMsg));

		// pause stuff
		vc.dispatcher.pause();
	}),

	vresume: new Command(CATEGORY, null, (cmd, msg) => {
		let vc = getVoice(msg);

		if (!isMemberVoice(msg))
			return msg.reply('Please join a voice channel first!').then((botMsg) => trash(msg, botMsg));
		if (!vc)
			return msg.reply('Bot not in voice chat').then((botMsg) => trash(msg, botMsg));

		// pause stuff
		vc.dispatcher.resume();
	}),

	vskip: new Command(CATEGORY, null, (cmd, msg) => {
		let vc = getVoice(msg);

		if (!isMemberVoice(msg))
			return msg.reply('Please join a voice channel first!').then((botMsg) => trash(msg, botMsg));
		if (!vc)
			return msg.reply('Bot not in voice chat').then((botMsg) => trash(msg, botMsg));

		// Short-circuit null check, only kill if the dispatcher exists

		console.log(vc.dispatcher.end);

		vc.dispatcher.destroy((e) => {
			console.log(e ? e : 'eh')
		});
		console.log('fyck')

	})

	// vvup: (msg) => {

	// },

	// vvdown: (msg) => {

	// }
}

// Plays audio and handles queue
function play(vc, item, channel) {
	// Create a queue for voice channel if it doesn't exist already
	if (!queue[vc.channel.id]) queue[vc.channel.id] = [];

	// Nothing playing so start playing item
	if (!vc.dispatcher) {
		let newMsg;
		channel.send(new MessageEmbed().setAuthor(`Now playing audio in ${vc.channel.name}`))
			.then((mNewMsg) => newMsg = mNewMsg)

			// Play the audio
			.then(() => vc.play(item, { type: 'opus', quality: 'highestaudio', highWaterMark: 1 << 25 }))
			.then((dispatcher) => {

				// ytdl-core had weird issues and ytdl-core-discord had weird issues without highWaterMark parameter so monitor any other potential issues
				dispatcher.on('error', (err) => log.warn(err));

				// When the current audio is finished playing, play the next in queue (if applicable) and delete the previous "playing" message
				dispatcher.on('close', () => {
					queue[vc.channel.id].length > 0 && play(vc, queue[vc.channel.id].shift(), channel);
					newMsg.delete();
				});
			})

			// Create the play/pause button
			.then(() => Promise.all([newMsg.react('⏯'), newMsg.createReactionCollector((reaction, user) => reaction.emoji.name === '⏯' && user.id !== client.id)]))
			.then((results) =>
				results[1].on('collect', (reaction, user) => {
					vc.dispatcher && vc.dispatcher.paused ? vc.dispatcher.resume() : vc.dispatcher.pause();
					newMsg.reactions.resolve(reaction).users.remove(user.id);
				}))
			.catch((err) => log.warn(err));

	} else { // Add item to queue
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