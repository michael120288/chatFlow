const isDev = process.env.NODE_ENV === 'development';
const isDebugEnabled = process.env.REACT_APP_DEBUG_LOGS === 'true';
const shouldLog = isDev || isDebugEnabled;

const logger = {
  info: (...args) => shouldLog && console.info('[INFO]', ...args),
  warn: (...args) => shouldLog && console.warn('[WARN]', ...args),
  error: (...args) => console.error('[ERROR]', ...args),
  debug: (...args) => isDev && console.debug('[DEBUG]', ...args)
};

export default logger;
