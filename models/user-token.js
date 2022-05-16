const mongoose = require('mongoose');
const moment = require('moment');
const utils = require('../helpers/util');
const schema = new mongoose.Schema(
	{
		uid: { type: String },
		authtoken: { type: String },
		pub_sub_token : { type : String},
		valid_till: { type: Date },
		user_uid: { type: Number},
		expire_at: { type: Date },
		idle_valid_till: { type: Date },
		deleted_at: { type: Date, default: null },
	},
	{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

schema.pre('save', async function (next) {
	var self = this;
	if (!self.uid) {
		self.uid = utils.generateUid();
		return next();
	} else {
		return next();
	}
});

schema.statics = {
	createAuthToken: async function (user, remembered_user) {
		let tokenObj = {
			user_uid: user.uid,
			authtoken: utils.generateUid('tokn'),
			pub_sub_token : utils.generateUid("pubsub-")
		};
		let current_date = new Date();

		if (remembered_user) {
			tokenObj['valid_till'] = moment(current_date).add(config.login.REMEMBER_ME_HOURS, 'hours');
		} else {
			tokenObj['valid_till'] = moment(current_date).add(config.login.LOGIN_TOKEN_HOURS, 'hours');
		}
		tokenObj['idle_valid_till'] = tokenObj['valid_till'];
		return this.create(tokenObj);
	},
	authenticate: async function (authtoken, returnType) {
		let current_date = new Date();
		let userToken = await this.findOne({ authtoken: authtoken, deleted_at: null }).lean();
		if (userToken) {
			let valid_token = userToken.valid_till >= current_date;
			if (valid_token) {
				let valid_till = moment(current_date).add(10, 'hour').toDate();
				await this.updateOne(
					{ authtoken: authtoken, deleted_at: null },
					{ valid_till: valid_till }
				);
				return userToken.user_uid;
			} else {
				await this.updateOne(
					{ authtoken: authtoken, deleted_at: null },
					{ deleted_at: new Date(), expire_at: new Date() }
				);
			}
			return valid_token;
		} else {
			return false;
		}
	},
	getTokenUser: function (user_uid) {
		return _models.User.findOne({ uid: user_uid })
								.select({
									login_count : 0,
									login_attempts : 0,
									password: 0,
									activated : 0,
									_id : 0,
									__v : 0
								})
								.lean();
	},
	logout: function (token) {
		return this.remove({ authtoken: token, deleted_at: null }, { multi: true });
	},
	expiresPreviousTokens: function (user) {
		return this.updateMany({ user_uid: user.uid }, { deleted_at: new Date() }, { multi: true });
	},
};
module.exports = {
	name: 'UserToken',
	schema: schema,
};
