require('dotenv').config();
const validateEnvironmentVariables = require('./lib/infrastructure/validate-environement-variables');
validateEnvironmentVariables();

const createServer = require('./server');
const logger = require('./lib/infrastructure/logger');
const { disconnect } = require('./db/knex-database-connection');

let server;

const start = async function () {
  server = await createServer();
  await server.start();
};

async function _exitOnSignal(signal) {
  logger.info(`Received signal: ${signal}.`);
  logger.info('Stopping HAPI server...');
  await server.stop({ timeout: 30000 });
  logger.info('Closing connexions to database...');
  await disconnect();
  // eslint-disable-next-line node/no-process-exit
  process.exit();
}

process.on('SIGTERM', () => {
  _exitOnSignal('SIGTERM');
});
process.on('SIGINT', () => {
  _exitOnSignal('SIGINT');
});

(async () => {
  try {
    await start();
  } catch (error) {
    logger.error(error);
    throw error;
  }
})();
