// adilibs-backend/utils/logger.js
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Log files
const errorLogPath = path.join(logsDir, 'error.log');
const accessLogPath = path.join(logsDir, 'access.log');

/**
 * Format log message with timestamp and level
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @returns {string} - Formatted log message
 */
const formatLogMessage = (level, message) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level}] ${message}\n`;
};

/**
 * Write log to file
 * @param {string} filePath - Path to log file
 * @param {string} message - Log message
 */
const writeToFile = (filePath, message) => {
  fs.appendFile(filePath, message, (err) => {
    if (err) {
      console.error(`Failed to write to log file: ${err.message}`);
    }
  });
};

/**
 * Log error message
 * @param {string|Error} message - Error message or Error object
 * @param {object} [context] - Additional context for the error
 */
const error = (message, context = {}) => {
  let errorMessage;

  if (message instanceof Error) {
    errorMessage = `${message.message}\nStack: ${message.stack}`;

    // Add additional error properties if available
    if (message.code) {
      context.errorCode = message.code;
    }
  } else {
    errorMessage = message;
  }

  // Add context if provided
  if (Object.keys(context).length > 0) {
    errorMessage += `\nContext: ${JSON.stringify(context)}`;
  }

  // Log to console
  console.error(errorMessage);

  // Log to file
  const formattedMessage = formatLogMessage('ERROR', errorMessage);
  writeToFile(errorLogPath, formattedMessage);
};

/**
 * Log info message
 * @param {string} message - Info message
 */
const info = (message) => {
  // Log to console
  console.log(message);

  // Log to file
  const formattedMessage = formatLogMessage('INFO', message);
  writeToFile(accessLogPath, formattedMessage);
};

/**
 * Log debug message (only in development)
 * @param {string} message - Debug message
 * @param {object} [data] - Additional data for debugging
 */
const debug = (message, data = null) => {
  // Only log in development
  if (process.env.NODE_ENV !== 'production') {
    let debugMessage = message;

    // Add data if provided
    if (data) {
      debugMessage += `\nData: ${JSON.stringify(data, null, 2)}`;
    }

    // Log to console
    console.debug(debugMessage);

    // Log to file
    const formattedMessage = formatLogMessage('DEBUG', debugMessage);
    writeToFile(accessLogPath, formattedMessage);
  }
};

/**
 * Log warning message
 * @param {string} message - Warning message
 */
const warn = (message) => {
  // Log to console
  console.warn(message);

  // Log to file
  const formattedMessage = formatLogMessage('WARN', message);
  writeToFile(accessLogPath, formattedMessage);
};

/**
 * Log HTTP request
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next function
 */
const httpLogger = (req, res, next) => {
  const start = Date.now();

  // Once the request is processed
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;

    // Log based on status code
    if (res.statusCode >= 500) {
      error(log);
    } else if (res.statusCode >= 400) {
      warn(log);
    } else {
      info(log);
    }
  });

  next();
};

module.exports = {
  error,
  info,
  debug,
  warn,
  httpLogger,
};
