let salt = config.SALT;
var _ = require("lodash");
const crypto = require("crypto");

var Util = {
  encryptPassword: function (password) {
    if (!password) {
      return "";
    } else {
      return String(this.stringToHash(password, salt));
    }
  },
  stringToHash: function (string) {
    string = typeof string === "string" ? string : JSON.stringify(string);
    var hash = 0;
    if (string.length == 0) return hash;
    for (let i = 0; i < string.length; i++) {
      let char = string.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash;
  },
  generateUid: function (prefix, length) {
    let key_length = length || 11;
    if (prefix) {
      return prefix + crypto.randomBytes(key_length).toString("hex");
    }
    return "ora" + crypto.randomBytes(key_length).toString("hex");
  },
  /**
   * Checks if user submitted form data contains the required fields
   * and returns error message incase required field is not present
   * Make sure to update descriptive message in respective json files
   * located at /backend/messages/en-US
   *
   * @param {Array} fields Contains string array of required field names
   * @param {Object} inputs Contains the body received by post method
   */
  checkRequiredFields(fields, inputs) {
    let output = {
      error: false,
      message: "_REQUIRED",
    };
    for (let key of fields) {
      if (!inputs[key] && inputs[key] !== false) {
        output.error = true;
        output.message = `${key.toUpperCase()}${output.message}`;
        break;
      }
    }
    return output;
  },
  /**
   * Takes string and max length as input parameters and returns true if input is a string
   * and is not greater than max length
   * @param {String} str    Input string to be validated
   * @param {Number} length Max length allowed
   */
  validateStringLength(str, length) {
    if (str && typeof str === "string" && str.length <= length) {
      return true;
    }
    return false;
  },
  isEmailContains: function (text) {
    var re =
      /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    return re.test(text);
  },
  isValidPasswordPattern(password) {
		const password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,}$/;
		if (password && password.match(password_regex)) {
			return true;
		} else {
			return false;
		}
	}

};
const isObject = (obj) => obj != null && obj.constructor.name === "Object";


var removeAttrDeep = (obj, req) => {
  for (prop in obj) {
    customizeKeyAsPerUserType(prop, obj, req);
    if (isKeyExists(prop)) {
      delete obj[prop];
    } else if (_.isArray(obj[prop])) {
      obj[prop] = obj[prop].filter((k) => {
        return !_.isEmpty(removeAttrDeep(k, req));
      });
    } else if (isObject(obj[prop])) {
      removeAttrDeep(obj[prop], req);
    }
  }
  return obj;
};

function customizeKeyAsPerUserType(key, obj, req) {
  if (key === "mobile" && req && req.user && req.user.user_type === "talent") {
    obj.phone_number = obj[key];
  }
}

function isKeyExists(prop) {
  let retricted_keys = [
    "email_address",
    "activated",
    "password",
    "token_valid_till",
    "reset_password_valid_till",
    "attemtps",
    "activation_token",
    "login_attempts",
    "lock_until",
    "resend_time",
    "mobile",
  ];
  if (_.includes(retricted_keys, prop)) {
    return true;
  } else {
    return false;
  }
}
module.exports = Util;
