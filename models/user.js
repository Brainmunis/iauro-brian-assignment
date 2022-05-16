const mongoose = require("mongoose");
const utils = require("../helpers/util");

const AdminuserSchema = new mongoose.Schema(
  {
    uid: { type: Number },
    name : { type : String},
    email_address: { type: String },
    activated: { type: Boolean, default: false },
    password: { type: String },
    user_type: { type: String },
	phone : { type: String },
    token_valid_till: { type: Date },
    resend_time: { type: Date },
    reset_password_token: { type: String },
    reset_password_valid_till: { type: Date },
    activation_token: { type: String },
    login_attempts: { type: Number },
    lock_until: { type: Date },
    last_login_time: { type: Date },
    login_count: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

AdminuserSchema.pre("save", async function (next) {
  if (!this.uid) {
    this.password = utils.encryptPassword(this.password);
    next()
  }
});


AdminuserSchema.statics = {
   _create : function(data){
      const user = {
        name : data.name,
        password : data.password,
        email_address : data.email_address,
        user_type : data.user_type,
      };
      return this.create(user);
   },
   login: async function (email_address, password, remembered_user) {
		let encryptedPassword = utils.encryptPassword(password);
		let user = await this.findOne({ email_address }).lean();
		if (!user) {
			throw translate('INVALID_CREDENTIALS');
		}
	
		if (this.isUserLocked(user)) {
			throw translate('USER_LOCK_EXEEDED_LOGIN_ATTEMPTS', {
				date: user.lock_until && user.lock_until.toISOString(),
			});
		}
		if (this.isUserLockedExpired(user)) {
			const [un_err, unlockStatus] = await wait(this.unlockUser, this, user);
			if (un_err) {
				throw translate('SOMETHING_WENT_WRONG');
			}
			user = unlockStatus;
		}
		if (user && user.password === encryptedPassword) {
			if (user.login_attempts > 0) {
				const [un_err, unlockStatus] = await wait(this.unlockUser, this, user);
				if (un_err) {
					throw translate('SOMETHING_WENT_WRONG');
				}
			}
			const tokenData = await _models.UserToken.createAuthToken(user, remembered_user);
			user.authtoken = tokenData.authtoken
			user.pub_sub_token = tokenData.pub_sub_token;
			return user;
		} else {
			let [err, incStaus] = await wait(this.increamentLoginAttempts, this, user);
			if (err) {
				console.log('login user error --', JSON.stringify(err));
				throw translate('SOMETHING_WENT_WRONG');
			}
			user = incStaus;
			if (this.isNeedToLocked(user)) {
				var [lock_err, lockedUserData] = await wait(this.lockedUser, this, user);
				if (lock_err) {
					throw translate('SOMETHING_WENT_WRONG');
				}
				throw translate('USER_LOCK_EXEEDED_LOGIN_ATTEMPTS', {
					date: lockedUserData.lock_until && lockedUserData.lock_until.toISOString(),
				});
			}

			const warning_threshold = config.login.WARNING_ATTEMPTS_COUNT;
			if (user.login_attempts >= warning_threshold) {
				let remaining_attemps = config.login.MAX_LOGIN_ATTEMPTS - user.login_attempts;
				throw translate('INVALID_CREDENTIALS_WARNING', { count: remaining_attemps });
			}
			throw translate('INVALID_CREDENTIALS');
		}
	},
  isNeedToLocked: function (user) {
		return !!(user.login_attempts >= config.login.MAX_LOGIN_ATTEMPTS && !this.isUserLocked(user));
	},
  isUserLocked: function (user) {
		return user.lock_until && user.lock_until > Date.now();
	},
	isUserLockedExpired: function (user) {
		return !!(user.lock_until && user.lock_until < Date.now());
	},
  increamentLoginAttempts: async function (user) {
		const userQuery = {
			uid: user.uid,
		};
		const updates = { $inc: { login_attempts: 1 } };
		return this.findOneAndUpdate(userQuery, updates, { new: true });
	},
  unlockUser: function (user) {
		let query = {
			uid: user.uid,
		};
		return this.findOneAndUpdate(
			query,
			{
				$set: { login_attempts: 0 },
				$unset: { lock_until: 1 },
			},
			{
				new: true,
			}
		);
	},
  lockedUser: function (user) {
		const userQuery = {
			uid: user.uid,
		};
		const lockQuery = {
			$set: {
				lock_until: moment(new Date()).add(config.login.USER_LOCK_HOUR, 'hours'),
			},
		};
		return this.findOneAndUpdate(userQuery, lockQuery, { new: true });
	},
  changePassword: async function ({ uid, user_type, password }, oldPassword, newPassword) {
		let hashed_old_pass = utils.encryptPassword(oldPassword);
		let hashed_new_pass = utils.encryptPassword(newPassword);

		if(password === hashed_new_pass){
			throw 'NEW_PASSWORD_CANNOT_BE_THE_SAME_AS_CURRENT_PASSWORD'
		}
		let store = await this.findOne({ uid, user_type });
		if (!store) {
			throw 'INVALID_USER';
		}
		if (store.password !== hashed_old_pass) {
			throw 'INVALID_OLD_PASSWORD';
		}
		return this.updateOne({ uid, user_type }, { password: hashed_new_pass }).lean();
	}
}

module.exports = {
  name: "User",
  schema: AdminuserSchema,
  inc_field : "uid"
};
