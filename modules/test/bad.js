const Command = require('../../Command');

class Bad extends Command {
	execute(msg) {
		throw new Error('This is fine.');
	}
}

module.exports = Bad;
