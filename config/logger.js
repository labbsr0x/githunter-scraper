const { createLogger, format, transports } = require('winston');
const config = require('config');

const { combine, timestamp, colorize, align, printf } = format;

const enumerateErrorFormat = format(info => {
  if (info.message instanceof Error) {
    info.message = {
      message: info.message.message,
      stack: info.message.stack,
      ...info.message,
    };
  }

  if (info instanceof Error) {
    return {
      message: info.message,
      stack: info.stack,
      ...info,
    };
  }

  return info;
});

const myFormat = combine(
  colorize(),
  timestamp(),
  align(),
  printf(log => `${log.timestamp} [${log.level}]: ${log.message}`),
);

const getLogLevel = () => {
  const loggerConf = config.get('logger');
  console.log(`Set logger config:`, loggerConf);
  if (loggerConf && loggerConf.level) {
    return loggerConf.level;
  }
  return 'debug';
};

const logger = createLogger({
  format: format.combine(
    enumerateErrorFormat(),
    format.splat(),
    format.simple(),
  ),
  transports: [
    new transports.Console({ format: myFormat, level: getLogLevel() }),
  ],
});

module.exports = logger;
