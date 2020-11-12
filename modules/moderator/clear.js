const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');
const { log } = require('../../utils');

class ClearCommand extends Command {
	execute(msg) {
		const { args } = this.parseArgs(msg);
		let channel = msg.channel;

		// amount is total user wants deleted plus the message calling the command
		let amount = parseInt(args[0]) + 1;

		// leftover is messages when amount is below 100, or the remainder when amount > 100
		// This is required since bulkDelete only deletes 100 at a time
		let leftover = amount % 100;

		// Discord API won't let us delete more than 100 messages at a time
		return hundredPlus(amount)

			// Delete the messages not included in the bulk delete (this is always less than 100)
			.then(() => channel.bulkDelete(leftover))

			// Tell the user we deleted all the messages
			.then(() => {
				log.info(`Deleted ${amount - 1} (${amount}) messages`);
				return channel.send(`:bomb: Deleted **\`${args[0]}\`** messages!`);
			})

			// Delete the bot message after 1.5 seconds
			.then((bombMessage) => setTimeout(() => bombMessage.delete(), 1500));

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
								setTimeout(() => completed === total ? resolve(total) : promises[i + 1]().then((result) => resolve(result)), 2500);
							});
					}));
				}

				// Wait for all deletion tasks to complete
				promises[0]()
					.then((result) => {
						log.info(`Bulk deletion task complete! Deleted ${result} messages out of ${amount} total`);
						setTimeout(() => resolve(result), 2500);
					})
					.catch((err) => log.warn(err));
			});
		}
	}
}

module.exports = ClearCommand;
