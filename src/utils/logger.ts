
type LogLevel = 'info' | 'warn' | 'error';

const log = (level: LogLevel, message: string, data?: unknown) => {
  const timestamp = new Date().toISOString();
  
  // Always log the hostname to help with subdomain debugging
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'server-side';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : 'no-path';
  
  const baseInfo = { hostname, pathname, timestamp };
  
  if (data) {
    // Ensure data is treated as a record/object before spreading
    const safeData = typeof data === 'object' && data !== null ? data : { value: data };
    console[level](`${timestamp} ${level}: ${message}`, { ...baseInfo, ...safeData });
  } else {
    console[level](`${timestamp} ${level}: ${message}`, baseInfo);
  }
  
  // For errors, also log to browser console in a visible format
  if (level === 'error') {
    const safeData = data && typeof data === 'object' && data !== null ? data : { value: data };
    console.error(`%c${message}`, 'color: red; font-weight: bold;', { ...baseInfo, ...(data ? safeData : {}) });
  }
};

export const logger = {
  info: (message: string, data?: unknown) => log('info', message, data),
  warn: (message: string, data?: unknown) => log('warn', message, data),
  error: (message: string, data?: unknown) => log('error', message, data)
};
