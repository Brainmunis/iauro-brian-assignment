const { join } = require("path");
const chalk = require("chalk");

const loadConfig = (appRoot) => {
  let env = String(process.env.NODE_ENV || "local");
  env = env.toLowerCase();
  try {
    console.log(`Envirment set to ${chalk.red.bold(env)}`);
    const configPath = join(appRoot, "env", `${env}.json`);
    const config = require(configPath);
    console.log(`Config file path is ${chalk.green.bold(configPath)}`);
    config.environment = env;
    config.configPath = configPath;
    return config;
  } catch (e) {
    console.log(`Error in loading config file ${e.stack}`);
  }
};

module.exports = loadConfig;
