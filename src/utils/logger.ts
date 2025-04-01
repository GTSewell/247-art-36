
type LogLevel = 'info' | 'warn' | 'error';

const log = (level: LogLevel, message: string, data?: unknown) => {
  const timestamp = new Date().toISOString();
  
  if (data) {
    console[level](`${timestamp} ${level}: ${message}`, data);
  } else {
    console[level](`${timestamp} ${level}: ${message}`);
  }
};

export const logger = {
  info: (message: string, data?: unknown) => log('info', message, data),
  warn: (message: string, data?: unknown) => log('warn', message, data),
  error: (message: string, data?: unknown) => log('error', message, data)
};
