/**
 * OpenTelemetry SDK initialization — import this BEFORE any other module.
 *
 * Usage in app entry point:
 *   import './otel-init.js';
 *   import express from 'express';
 *
 * Replace SERVICE_NAME with the app name (e.g., 'guard-api').
 *
 * Reference: observability-otel rule
 */
import { initTelemetry } from '@turbi/shared-observability';

initTelemetry({
  serviceName: 'SERVICE_NAME',
  serviceVersion: process.env['APP_VERSION'] ?? '0.0.0',
});
