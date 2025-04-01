
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const log = (level: LogLevel, message: string, data?: unknown) => {
  const timestamp = new Date().toISOString();
  
  // Check if running in a browser environment
  const isBrowser = typeof window !== 'undefined';
  
  try {
    if (data) {
      console[level](`${timestamp} ${level}: ${message}`, data);
      
      // If we're in development or testing, also log to local storage for debugging
      if (isBrowser && (process.env.NODE_ENV === 'development' || localStorage.getItem('debugLogging') === 'true')) {
        const logs = JSON.parse(localStorage.getItem('appLogs') || '[]');
        logs.push({ timestamp, level, message, data });
        localStorage.setItem('appLogs', JSON.stringify(logs.slice(-100))); // Keep last 100 logs
      }
    } else {
      console[level](`${timestamp} ${level}: ${message}`);
      
      if (isBrowser && (process.env.NODE_ENV === 'development' || localStorage.getItem('debugLogging') === 'true')) {
        const logs = JSON.parse(localStorage.getItem('appLogs') || '[]');
        logs.push({ timestamp, level, message });
        localStorage.setItem('appLogs', JSON.stringify(logs.slice(-100)));
      }
    }
  } catch (error) {
    // Failsafe - if logging itself fails, try a basic console error
    try {
      console.error('Logging failed:', error);
    } catch (_) {
      // Silent catch as a last resort
    }
  }
};

export const logger = {
  debug: (message: string, data?: unknown) => log('debug', message, data),
  info: (message: string, data?: unknown) => log('info', message, data),
  warn: (message: string, data?: unknown) => log('warn', message, data),
  error: (message: string, data?: unknown) => log('error', message, data),
  
  // Methods to help with diagnostics
  getLogs: (): any[] => {
    try {
      return JSON.parse(localStorage.getItem('appLogs') || '[]');
    } catch (e) {
      return [];
    }
  },
  
  clearLogs: () => {
    try {
      localStorage.removeItem('appLogs');
    } catch (e) {
      // Silent catch
    }
  },
  
  enableDebugLogging: () => {
    try {
      localStorage.setItem('debugLogging', 'true');
    } catch (e) {
      // Silent catch
    }
  },
  
  disableDebugLogging: () => {
    try {
      localStorage.removeItem('debugLogging');
    } catch (e) {
      // Silent catch
    }
  }
};
