const _ = require('lodash');

function validateEmail(email) {
	const emailRegex = /\S+@\S+\.\S+/;
	let error = null;
	if (_.isEmpty(email)) {
		error = translate('EMAIL_ADDRESS_REQUIRED');
	} else if (email && email.length > 300) {
		error = translate('INVALID_EMAIL_LENGTH');
	} else if (!emailRegex.test(email)) {
		error = translate('INVALID_EMAIL_FORMAT');
	}
	return error;
}

module.exports = {
    validateEmail
};