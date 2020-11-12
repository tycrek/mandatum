const Command = require('../../Command');
const { log } = require('../../utils');

class SendCommand extends Command {
	execute(msg) {
		const { args } = this.parseArgs(msg);
		let count = parseInt(args[0]);

		log.info(`Sending ${count} messages to channel ${msg.channel.name} in ${msg.guild.name}`);

		return msg.delete()
			.then(() => {
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
				return messages[0]()
			})
			.then(() => log.info(`Completed sending ${count} messages to channel ${msg.channel.name} in ${msg.guild.name}`))
			.then(() => msg.member.createDM())
			.then((channel) => channel.send(`**${count}** messages created!`));
	}
}

module.exports = SendCommand;
