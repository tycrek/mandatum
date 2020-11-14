const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');
const { log } = require('../../utils');

class RulesReactionCommand extends Command {
	execute(msg) {
		const { args } = this.parseArgs(msg);
		args.shift();

		let role = msg.mentions.roles.first();
		let text = args.join(' ');
		let reaction;
		let setupMsg;
		let reactMsg;

		return msg.channel.send('Please react with the emoji you wish to use to assign a role')
			.then((mSetupMsg) => setupMsg = mSetupMsg)
			.then((setupMsg) => setupMsg.awaitReactions((_reaction, user) => user.id === msg.author.id, { max: 1 }))
			.then((reactions) => reaction = reactions.first())
			.then(() =>
				msg.channel.send(
					new MessageEmbed()
						.setTitle('React for role')
						.setDescription(`Please react to this message with ${reaction.emoji} to receive ${role}.\n\nBy reacting, you confirm you have read and agree to our rules.`)))
			.then((mMsg) => reactMsg = mMsg)
			.then(() => reactMsg.react(reaction.emoji))
			.then(() => reactMsg.createReactionCollector((mReaction, user) => mReaction.emoji.name == reaction.emoji.name))
			.then((collector) => {
				collector.on('collect', (reaction, user) => {
					reaction.message.reactions.resolve(reaction).users.remove(user.id);
					reaction.message.guild.members.resolve(user.id).roles.add(role)
				})
			})
			.then(() => {
				this.setConfig(msg, 'settings', 'rulesreaction', 'roleId', role.id);
				this.setConfig(msg, 'settings', 'rulesreaction', 'guildId', msg.guild.id);
				this.setConfig(msg, 'settings', 'rulesreaction', 'channelId', msg.channel.id);
				this.setConfig(msg, 'settings', 'rulesreaction', 'messageId', reactMsg.id);
				this.setConfig(msg, 'settings', 'rulesreaction', 'emojiName', reaction.emoji.name);
			})
			.then(() => {
				setupMsg.delete();
				msg.delete();
			});
	}
}

module.exports = RulesReactionCommand;
