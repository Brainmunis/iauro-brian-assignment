const { getUserPermissions } = require('../../middleware/validatePermission');
const { merge, isEmpty } = require('lodash');

async function getCurrentUser(req, res, next) {
	const user = req.user;
	if(isEmpty(user)) {
		return res.error('UNAUTHORIZED');
	}
	let finalUserObj = merge(user, { capabilities: getUserPermissions(user.user_type) });
	
    return res.success(finalUserObj);
}

module.exports = getCurrentUser;
