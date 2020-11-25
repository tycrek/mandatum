const Command = require('../../Command');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

const satoshi = 100000000;

class BTCCommand extends Command {
	execute(msg) {
		const { args } = this.parseArgs(msg);

		let currency = 'USD';

		if (args.length > 0) {
			if (args[0] !== 'bal' || args[2])
				currency = args[args[0] !== 'bal' ? 0 : 2].toUpperCase();
			if (args[0] === 'bal' && args.length < 2)
				return this.help(msg);
		}

		return checkCurrency(currency)
			.then((realCurrency) => args[0] === 'bal' ? balanceEmbed(args[1], currency) : currencyEmbed(realCurrency))
			.then((embed) => msg.channel.send(embed))
			.then((botMsg) => this.trash(msg, botMsg));
	}
}

function checkCurrency(currency) {
	return fetch('https://api.coindesk.com/v1/bpi/supported-currencies.json')
		.then((res) => res.json())
		.then((currencies) => !currencies.map(({ currency }) => currency).includes(currency) ? 'USD' : currency);
}

function currencyEmbed(currency) {
	return fetch(`https://api.coindesk.com/v1/bpi/currentprice/${currency}.json`)
		.then((res) => res.json())
		.then((json) => json.bpi[currency].rate)
		.then((price) =>
			new MessageEmbed()
				.setTitle(`${price} ${currency}`)
				.setThumbnail('https://i.imgur.com/M6TgoKg.png')
				.setDescription('*Powered by [CoinDesk](https://www.coindesk.com/price/bitcoin)*')
				.setColor(0xF79019));
}

function balanceEmbed(address, currency) {
	return Promise.all([fetch(`https://blockchain.info/q/addressbalance/${address}`), fetch(`https://api.coindesk.com/v1/bpi/currentprice/${currency}.json`)])
		.then((results) => Promise.all([results[0].text(), results[1].json()]))
		.then((results) => ({ text: results[0].toString(), json: results[1] }))
		.then(({ text, json }) =>
			new MessageEmbed()
				.setTitle('Bitcoin balance')
				.setDescription(`\`${address}\`\n\n` + (text.includes('Invalid') ? text : (`${text / satoshi} BTC = ${(parseInt(json.bpi[currency].rate.replace(/\,/g, '')) * (text / satoshi)).toFixed(2)} ${currency}`)))
				.setThumbnail('https://i.imgur.com/M6TgoKg.png')
				.setColor(0xF79019));
}

module.exports = BTCCommand;
