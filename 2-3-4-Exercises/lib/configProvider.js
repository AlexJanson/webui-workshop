import { LogManager } from '@aliceo2/web-ui';
import { realpath } from 'node:fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const logger = LogManager.getLogger(`${process.env.npm_config_log_label ?? 'qcg'}/config`);

const DEFAULT_CONF_LOCATION = './../config.js';

let config = {};
let configFilePath = _getConfigurationFilePath();

try {
  configFilePath = await realpath(configFilePath);
  ({ config } = await import(configFilePath));

  logger.info(`Configuration file successfully read from: "${configFilePath}"`);
} catch (err) {
  logger.error(`Unable to read configuration file (${configFilePath}) due to: ${err.message}`);
  process.exit(1);
}

/**
 * Method to retrieve the path to the configuration file
 * This can be either:
 * * default location at the root of the project - `./../../config.js`
 * * location can be set as argument during command line execution
 * @returns {string} - path to the configuration file
 */
function _getConfigurationFilePath() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  if (process.argv.length >= 3 && /\.m{0,1}js$/.test(process.argv[2])) {
    return process.argv[2];
  } else {
    return join(__dirname, DEFAULT_CONF_LOCATION);
  }
}

export { config, DEFAULT_CONF_LOCATION };