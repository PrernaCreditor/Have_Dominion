const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const currentLogLevel = logLevels[process.env.LOG_LEVEL || 'info'];

const formatLog = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    level,
    service: 'auth-backend-service',
    timestamp,
    message,
    ...(data && { data }),
  };
  return JSON.stringify(logEntry);
};

const logger = {
  error: (message, data) => {
    if (currentLogLevel >= logLevels.error) {
      const log = formatLog('error', message, data);
      console.error(log);
      fs.appendFileSync(path.join(logDir, 'error.log'), log + '\n');
    }
  },

  warn: (message, data) => {
    if (currentLogLevel >= logLevels.warn) {
      const log = formatLog('warn', message, data);
      console.warn(log);
    }
  },

  info: (message, data) => {
    if (currentLogLevel >= logLevels.info) {
      const log = formatLog('info', message, data);
      console.log(log);
    }
  },

  debug: (message, data) => {
    if (currentLogLevel >= logLevels.debug) {
      const log = formatLog('debug', message, data);
      console.log(log);
    }
  },
};

module.exports = { logger };