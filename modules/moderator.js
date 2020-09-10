/* Imports */
const { Client, MessageEmbed } = require('discord.js');
const { log, filter, noPermission } = require('../utils');
const prefix = require('../bot').prefix;
const owner = require('../bot').owner;

// export command functions
module.exports = {

	clear: (msg) => {
		// first if is role filter, second is user filter
		//if (!filter.role(msg, '752752772100653198')) return noPermission(msg);
		if (!filter.author(msg, owner)) return noPermission(msg);
		const args = msg.content.slice(prefix.length).trim().split(/ +/);
		let channel = msg.channel;

		// amount is total user wants deleted plus the message calling the command
		let amount = parseInt(args[1]) + 1;

		// leftover is messages when amount is below 100, or the remainder when amount > 100
		// This is required since bulkDelete only deletes 100 at a time
		let leftover = amount % 100;

		// Discord API won't let us delete more than 100 messages at a time
		hundredPlus(amount)

			// Delete the messages not included in the bulk delete (this is always less than 100)
			.then(() => channel.bulkDelete(leftover))

			// Tell the user we deleted all the messages
			.then(() => {
				log.info(`Deleted ${amount - 1} (${amount}) messages`);
				return channel.send(`:bomb: Deleted **\`${args[1]}\`** messages!`);
			})

			// Delete the bot message after 1.5 seconds
			.then((bombMessage) => setTimeout(() => bombMessage.delete(), 1500))
			.catch((err) => log.warn(err));

		// Deletes more than 100 messages
		function hundredPlus(amount) {
			// Resolves once we have deleted x hundred messages
			return new Promise((resolve) => {

				// If requested amount can be done all at once, resolve
				if (amount < 100) return resolve(0);

				// How many times we will need to delete 100 messages
				let iterations = parseInt((amount / 100).toString().split('.')[0]);

				// Used for logging purposes
				let completed = 0;
				let total = iterations * 100;

				// Each set of 100 is a separate Promise
				let promises = [];

				// Create the promisese
				for (let i = 0; i < iterations; i++) {
					promises.push(() => new Promise((resolve) => {
						log.info(`Bulk deletion task section [${i}] is running!`);

						// Delete bulk messages
						channel.bulkDelete(100)
							.then(() => {

								// Update completed and log progress
								completed += 100;
								log.info(`Bulk deletion task section [${i}] completed: Deleted ${completed} / ${total} bulk messages (${amount} total)`);

								// Wait two seconds before continuing. Two possible scenarios:
								//  1. We are on the last task and want to resolve everything back out of promises[0]
								//       completed === total ? resolve(total)
								//  2. We are not on the last task and need to recursively call the next task
								//       promises[i + 1]().then((result) => resolve(result))
								setTimeout(() => completed === total ? resolve(total) : promises[i + 1]().then((result) => resolve(result)), 2000);
							});
					}));
				}

				// Wait for all deletion tasks to complete
				promises[0]()
					.then((result) => {
						log.info(`Bulk deletion task complete! Deleted ${result} messages out of ${amount} total`);
						setTimeout(() => resolve(result), 2000);
					})
					.catch((err) => log.warn(err));
			});
		}
	},

	kick: (msg) => {
		if (!filter.author(msg, owner)) return noPermission(msg);
		const args = msg.content.slice(prefix.length).trim().split(/ +/);

		args.shift(); // Remove the command
		args.shift(); // Remove the user
		let reason = args.join(' ');

		let nick = msg.mentions.members.first().user.username;

		// Kick the user
		msg.mentions.members.first().kick(reason)
			.then(() => {
				let result = `Kicked **${nick}** for: *${reason}*`;
				log.info(result);
				return msg.reply(result);
			})
			.catch((err) => log.warn(err));
	},

	drole: (msg) => {
		if (!filter.author(msg, owner)) return noPermission(msg);

		let roleId = msg.mentions.roles.first().id;
		let roleName = msg.mentions.roles.first().name;

		msg.guild.roles.fetch(roleId)
			.then((role) => role.delete())
			.then(() => msg.channel.send(`Deleted role ${roleName}`))
			.catch((err) => log.warn(err));
	},

	crole: (msg) => {
		if (!filter.author(msg, owner)) return noPermission(msg);
		let args = msg.content.slice(prefix.length).trim().split(/ +/);
		args.shift(); // Remove the command

		// Sort the args by quotes
		args = args.join(' ').split(/" "+/);

		// Remove quote on the first argument
		args[0] = args[0].substring(1);

		// Remove quote on the last argument
		let lastArg = args[args.length - 1];
		args[args.length - 1] = lastArg.substring(0, lastArg.length - 1);

		// Check if the command has the required number of arguments
		if (args.length < 4 || args.length > 4) return msg.channel.send(new MessageEmbed()
			.setTitle('Usage')
			.setDescription(
				'`>crole "<name>" "<color>" "<permissions>" "<mentionable>"`' + '\n\n' +
				'`> name           ` String. Can have spaces.' + '\n' +
				'`> color          ` Must be a [ColorResolvable](https://discord.js.org/#/docs/main/stable/typedef/ColorResolvable)' + '\n' +
				'`> permissions    ` Must be `NONE` or a [PermissionResolvable](https://discord.js.org/#/docs/main/stable/typedef/PermissionResolvable)' + '\n' +
				'`> mentionable    ` Boolean.' + '\n' +
				'' + '\n' +
				'Note: All parameters must be contained within "quotes"'
			));

		// Create the role!
		msg.guild.roles.create(
			{
				data: {
					name: args[0],
					color: args[1],
					permissions: args[2] === 'NONE' ? 0 : /\d/g.test(args[2]) ? parseInt(args[2]) : args[2],
					mentionable: args[3] == 'true'
				}
			})
			.then((role) => msg.channel.send(`role [${role.toString()}] created`))
			.catch((err) => log.warn(err));
	}
}