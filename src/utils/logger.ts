
type LogLevel = 'info' | 'warn' | 'error';

const log = (level: LogLevel, message: string, data?: unknown) => {
  const timestamp = new Date().toISOString();
  
  // Always log the hostname to help with subdomain debugging
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'server-side';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : 'no-path';
  
  const baseInfo = { hostname, pathname, timestamp };
  
  if (data) {
    console[level](`${timestamp} ${level}: ${message}`, { ...baseInfo, ...data });
  } else {
    console[level](`${timestamp} ${level}: ${message}`, baseInfo);
  }
  
  // For errors, also log to browser console in a visible format
  if (level === 'error') {
    console.error(`%c${message}`, 'color: red; font-weight: bold;', { ...baseInfo, ...(data || {}) });
  }
};

export const logger = {
  info: (message: string, data?: unknown) => log('info', message, data),
  warn: (message: string, data?: unknown) => log('warn', message, data),
  error: (message: string, data?: unknown) => log('error', message, data)
};
