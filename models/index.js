const fs = require("fs");
exports.setup = function (db_mongoose, autoIncModule) {
  const promise = new Promise((resolve, reject) => {
    var models = {};
    fs.readdir(__dirname, function (err, files) {
      for (var i in files) {
        if (files[i] == "index.js") continue;
        if (files[i].split(".").length > 2) continue;
        if (isUsersReferenceFiles(files[i].split(".")[0])) continue;
        try {
          var t = require("./" + files[i]);
          if(t.inc_field){
            attachAutoInc(t, autoIncModule)
          }
          models[t.name] = db_mongoose.model(t.name, t.schema);
        } catch (e) {
          console.log(e);
        }
      }
      global._models = models;
      resolve("promise resolved");
    });
  });
  return promise;
};

function attachAutoInc({name, schema, inc_field}, autoIncFunc){
  schema.plugin(autoIncFunc.plugin, {
    model : name,
    field : inc_field,
    startAt: 1
  })
}
function isUsersReferenceFiles(fileName) {
  const { includes } = require("lodash");

  const referenceUserFile = ["talent", "employer", "agent"];
  return includes(referenceUserFile, fileName);
}
