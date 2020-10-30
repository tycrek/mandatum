const Command = require('../../Command');

class TestCommand extends Command {
	execute(msg) {
		msg.channel.send(`\`\`\`js\n${JSON.stringify(this.getConfig(msg.guild.id, true), null, 2)}\`\`\``);
		msg.reply(`Test success.\nMessage: ${this.getVariable('message', msg.guild.id)}\nNumber: ${this.getVariable('number', msg.guild.id)}`);
	}
}

module.exports = TestCommand;
