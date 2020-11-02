class RequiredError extends Error {
	constructor(message) {
		super(message);
		this.name = 'RequiredError';
	}
}

module.exports = RequiredError;
