const mongoose = require("mongoose");
const mongoUriBuilder = require("mongo-uri-builder");
const models = require("../models/index");
const autoIncrement  = require('mongoose-auto-increment');

const defaultOptions = {
  useMongoClient: true,
  native_parser: true,
  auth: {
    user: "admin",
    password: "root",
  },
  readPreference: "primaryPreferred",
  autoReconnect: true,
  poolSize: 8,
  keepAlive: 500,
  connectTimeoutMS: 20000,
  replicaSet: "",
  w: "majority",
  wtimeout: 2000,
};

let options = config.mongo.options || defaultOptions;
let connection_string = getConnStr(config.mongo, console, options);

module.exports = function initConnection(callback) {
  mongoose.connect(connection_string);
  var dbConnect = mongoose.connection;
  dbConnect.on("error", function (err) {
    console.log("Failed to connect to database");
    console.log(err);
    process.exit(1);
  });

  dbConnect.on("connecting", function () {
    console.log("connecting to Mongo DB...");
  });
  dbConnect.on("error", function (error) {
    console.error("error in mongo db connection: " + error);
  });
  dbConnect.on("connected", function () {
    console.log("mongo db connected!");
  });
  dbConnect.once("open", function () {
    autoIncrement.initialize(dbConnect);
    console.log("db connection opened.");
    models.setup(dbConnect, autoIncrement).then((res) => {
      console.log("Models Set Successfully.");
      callback();
    });
  });
  dbConnect.on("reconnected", function () {
    console.log("mongo db reconnected!");
  });
  dbConnect.on("disconnected", function () {
    console.error("mongo db disconnected!");
  });
};
function getConnStr(mongo, logger, opts) {
  logger.log(`db is: ${mongo.database}`);
  logger.log(`replicas: ${mongo.replicas}`);

  var connectionStr = mongoUriBuilder({
    username: encodeURIComponent(mongo.username),
    password: encodeURIComponent(mongo.password),
    host: mongo.replicas,
    replicas: mongo.replicaSet,
    database: mongo.database,
    options: opts,
  });

  return connectionStr;
}
