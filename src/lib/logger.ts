// src/lib/logger.ts — Centralized application logger (guardrail compliance)

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function formatLog(level: LogLevel, message: string, context?: Record<string, unknown>): string {
  return JSON.stringify({
    level,
    message,
    context: context || {},
    timestamp: new Date().toISOString(),
  });
}

export const logger = {
  info(message: string, context?: Record<string, unknown>): void {
    console.info(formatLog('info', message, context));
  },
  warn(message: string, context?: Record<string, unknown>): void {
    console.warn(formatLog('warn', message, context));
  },
  error(message: string, context?: Record<string, unknown>): void {
    console.error(formatLog('error', message, context));
  },
  debug(message: string, context?: Record<string, unknown>): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(formatLog('debug', message, context));
    }
  },
};
