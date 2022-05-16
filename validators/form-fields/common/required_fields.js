function required(fields, inputs) {
	let output = {
		error: false,
		message: '_REQUIRED',
	};
	for (let key of fields) {
		if (!inputs[key]) {
			output.error = true;
			output.message = translate(`${key.toUpperCase()}${output.message}`);
			break;
		}
	}
	return output;
}

module.exports = required;