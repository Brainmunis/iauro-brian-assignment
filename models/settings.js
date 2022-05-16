var mongoose = require("mongoose");
const utils = require("../helpers/util");

const after_login_tasks = new mongoose.Schema({
  set_available: Boolean,
});

const schema = new mongoose.Schema(
  {
    uid: { type: String },
    user_uid: { type: String },
    user_type: { type: String },
    language: {
      label: { type: String, default: "English" },
      value: { type: String, default: "EN_US" },
    },
    after_login_tasks
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

schema.pre("save", async function (next) {
  var self = this;
  if (!self.uid) {
    self.uid = utils.generateUid("sett", 10);
    return next();
  } else {
    return next();
  }
});

module.exports = {
  name: "Setting",
  schema: schema,
};
