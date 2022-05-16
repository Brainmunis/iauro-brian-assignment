const _ = require('lodash');
const { isValidPasswordPattern } = require('../../../helpers/util');

function validatePassword(password, pattern_match) {
	let error = null;
	if (!password) {
		error = translate('PASSWORD_REQUIRED');
	} else if ((password && password.length > 100) || password.length < 3) {
		error = translate('PASSWORD_MIN_LENGTH', { length: 100 });
	} else if (pattern_match && !isValidPasswordPattern(password)) {
		error = translate('INVALID_PASSWORD_PATTERN');
	}
	return error;
}

module.exports = {
	validatePassword
};