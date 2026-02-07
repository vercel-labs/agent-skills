/**
 * Structured JSON logger with PII/secret redaction.
 *
 * Usage:
 *   import { logger } from './logger.js';
 *   logger.info({ eventId, environmentId }, 'Processing event');
 *
 * Reference: observability-structured-logging, observability-pii-redaction rules
 */
import pino from 'pino';

export const logger = pino({
  level: process.env['LOG_LEVEL'] ?? 'info',
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'password',
      'secret',
      'token',
      '*.password',
      '*.secret',
      '*.token',
    ],
    censor: '[REDACTED]',
  },
});
