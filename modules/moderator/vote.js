const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');
const moment = require('moment-timezone');
moment.tz.setDefault('UTC');

class VoteCommand extends Command {
	execute(msg) {
		const { args } = this.parseArgs(msg);

		const emoji = {
			up: '👍',
			down: '👎'
		};

		if (parseInt(args[0]).toString() === 'NaN')
			return msg.reply(`you donkey, ${args[0]} isn't a number!`).then((botMsg) => this.trash(msg, botMsg));

		// General information about the vote
		let time = parseInt(args.shift());
		let topic = args.join(' ');
		let author = msg.member.displayName;

		// This is set and dealt with later
		let reactMsg;
		return msg.channel.send(
			new MessageEmbed()
				.setAuthor('Vote now!')
				.setTitle(`${topic}${!topic.endsWith('?') ? '?' : ''}`)
				.setFooter(`You have ${time} seconds to vote!\nVote ends at ${moment().add(time, 's').format('h:mm:ss a, MMMM Do, YYYY')} UTC`))
			.then((mReactMsg) => reactMsg = mReactMsg)

			// Wait for both reactions to appear before continuing (we get rate limited really easily with reactions)
			.then(() => Promise.all([reactMsg.react(emoji.up), reactMsg.react(emoji.down)]))

			// Listen for reactions for time in milliseconds
			.then((_reactions) => reactMsg.awaitReactions((reaction) => reaction.emoji.name === emoji.up || reaction.emoji.name === emoji.down, { time: time * 1000 }))

			// Process the collected reactions
			.then((collected) => {
				let votes = {
					[emoji.up]: 0,
					[emoji.down]: 0
				};

				// Go through the reactions (if no one clicks a reaction, it will not show up in collected. Subtract 1 to not count the bot)
				collected.each((col) => votes[col._emoji.name === emoji.up ? emoji.up : emoji.down] = col.count - 1);

				return votes;
			})
			.then((votes) =>
				Promise.all([
					reactMsg.edit(
						new MessageEmbed()
							.setAuthor('Votes are in!')
							.setTitle(`${topic}${!topic.endsWith('?') ? '?' : ''}`)
							.setDescription(`${emoji.up} : ${votes[emoji.up]}\u2003\u2003${emoji.down} : ${votes[emoji.down]}`)
							.setFooter(`Vote requested by ${author}\nVote Concluded at ${moment().format('h:mm:ss a, MMMM Do, YYYY')} UTC`)),
					reactMsg.reactions.removeAll()
				]))
			.then((_results) => this.trash(msg, reactMsg));
	}
}

module.exports = VoteCommand;
