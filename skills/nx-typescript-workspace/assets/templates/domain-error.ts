/**
 * Base domain error class with stable machine-readable codes.
 *
 * Usage:
 *   throw new DomainError(
 *     'EVENT_VALIDATION_FAILED',
 *     'Event payload missing required fields',
 *     { missingFields: ['environmentId', 'timestamp'] }
 *   );
 *
 * Reference: boundaries-structured-errors rule
 */
export class DomainError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}
