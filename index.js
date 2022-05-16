process.on("uncaughtExceptionMonitor", (err) => {
  console.log(`Caught uncaughtException ${err.message} \n ${err.stack}`);
});
process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at:", p, "reason:", reason);
});

const path = require("path");
const loadConfig = require("./helpers/config");

//setup config file
global.appRoot = path.resolve(__dirname);
global.config = loadConfig(appRoot);

const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");

const PORT = config.PORT || 5000;

const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const commonRes = require("./helpers/response");
const getRoutes = require("./routes");
const mongoose = require("./helpers/db_connect");

global.wait = require("./helpers/wait");
global.translate = require('./helpers/translate-message');

app.use(cors());
app.set("trust proxy", 1); // trust first proxy
app.use(express.urlencoded({ extended: true }));

app.use("/", (req, res, next) => {
  console.log(req.method + " " + req.url);
  next();
});

app.use(bodyParser.json());
app.use(mongoSanitize());

//--Setup Routes
app.use((req, res, next) => {
  res = commonRes.wrapResponse(req, res);
  next();
});

let routes = getRoutes.get(express.Router());
app.use(routes);

mongoose(function () {
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
});
