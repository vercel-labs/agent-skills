# Nx TypeScript Workspace

**Version 2.0.0**
Engineering
February 2026

> **Note:**
> This document is mainly for agents and LLMs to follow when maintaining,
> generating, or refactoring code in Nx TypeScript monorepo workspaces. Humans
> may also find it useful, but guidance here is optimized for automation
> and consistency by AI-assisted workflows.

---

## Abstract

Comprehensive guide for Nx TypeScript monorepo architecture, ESM builds, npm workspaces linking, Vitest testing, hexagonal architecture constraints, and project tags. Designed for AI agents and LLMs. Contains 33 rules across 8 categories, prioritized by impact from critical (architecture, ESM) to medium (observability, boundaries). Each rule includes explanations, incorrect vs. correct examples, and references.

---

## Table of Contents

1. [Architecture](#1-architecture) — **CRITICAL**
   - 1.1 [All Code MUST Live Under apps/, libs/, or tools/](#11-all-code-must-live-under-apps-libs-or-tools)
   - 1.2 [Product Features MUST Begin as Standalone Libraries](#12-product-features-must-begin-as-standalone-libraries)
   - 1.3 [Domain Libs Must Not Depend on Data/API/Infra/Tool](#13-domain-libs-must-not-depend-on-dataapiinfratool)
   - 1.4 [Domain Libs Are Pure — No I/O, No Framework Deps](#14-domain-libs-are-pure--no-io-no-framework-deps)
   - 1.5 [Apps Are Thin Composition Roots — No Business Logic](#15-apps-are-thin-composition-roots--no-business-logic)
2. [Module System](#2-module-system) — **CRITICAL**
   - 2.1 [package.json Must Have "type": "module"](#21-packagejson-must-have-type-module)
   - 2.2 [Must Include .js Extensions in ESM Imports](#22-must-include-js-extensions-in-esm-imports)
   - 2.3 [Never Use require/module.exports — Always ESM](#23-never-use-requiremoduleexports--always-esm)
   - 2.4 [Use import.meta.url — Never Bare __dirname](#24-use-importmetaurl--never-bare-__dirname)
3. [Build](#3-build) — **HIGH**
   - 3.1 [Referenced tsconfigs Must Have composite: true](#31-referenced-tsconfigs-must-have-composite-true)
   - 3.2 [Keep vitest.config.ts Out of tsconfig.lib.json](#32-keep-vitestconfigts-out-of-tsconfiglibjson)
   - 3.3 [No Circular TypeScript Project References](#33-no-circular-typescript-project-references)
   - 3.4 [Don't Modify tsconfig.base.json Without Reason](#34-dont-modify-tsconfigbasejson-without-reason)
4. [Linking](#4-linking) — **HIGH**
   - 4.1 [Lib package.json Must Have exports with @nx/source](#41-lib-packagejson-must-have-exports-with-nxsource)
   - 4.2 [Consumers Must Declare Workspace Dependencies](#42-consumers-must-declare-workspace-dependencies)
   - 4.3 [Never Use file:, link:, or Relative Paths](#43-never-use-file-link-or-relative-paths)
   - 4.4 [Never Use Root-Level TS Path Aliases for Workspace Libs](#44-never-use-root-level-ts-path-aliases-for-workspace-libs)
   - 4.5 [Root Workspaces Array Must Cover All Project Folders](#45-root-workspaces-array-must-cover-all-project-folders)
5. [Testing](#5-testing) — **HIGH**
   - 5.1 [Set Vitest Root to Workspace Root](#51-set-vitest-root-to-workspace-root)
   - 5.2 [Use import.meta.url Pattern in vitest.config.ts](#52-use-importmetaurl-pattern-in-vitestconfigts)
   - 5.3 [Use Workspace-Relative Include Paths](#53-use-workspace-relative-include-paths)
   - 5.4 [Tests MUST Be Written Before Implementation](#54-tests-must-be-written-before-implementation)
   - 5.5 [Testing Pyramid — Unit, Integration, E2E](#55-testing-pyramid--unit-integration-e2e)
   - 5.6 [Tests Must Be Deterministic](#56-tests-must-be-deterministic)
6. [Tags](#6-tags) — **MEDIUM**
   - 6.1 [Every Project MUST Have scope + type Tags](#61-every-project-must-have-scope--type-tags)
   - 6.2 [Tags Must Obey Hexagonal Dependency Rules](#62-tags-must-obey-hexagonal-dependency-rules)
7. [Boundaries](#7-boundaries) — **MEDIUM**
   - 7.1 [External Calls Must Use Typed Clients with Timeouts](#71-external-calls-must-use-typed-clients-with-timeouts)
   - 7.2 [Inputs Must Be Validated at Boundaries (Zod)](#72-inputs-must-be-validated-at-boundaries-zod)
   - 7.3 [Public TypeScript Surfaces Must Have Explicit Types — No any](#73-public-typescript-surfaces-must-have-explicit-types--no-any)
   - 7.4 [Errors Must Use Stable Codes and Standard Structures](#74-errors-must-use-stable-codes-and-standard-structures)
8. [Observability](#8-observability) — **MEDIUM**
   - 8.1 [Logging Must Be Structured JSON](#81-logging-must-be-structured-json)
   - 8.2 [OpenTelemetry Is Standard for Tracing and Metrics](#82-opentelemetry-is-standard-for-tracing-and-metrics)
   - 8.3 [Secrets and Tokens Must Be Redacted from Logs](#83-secrets-and-tokens-must-be-redacted-from-logs)

---

## 1. Architecture

**Impact: CRITICAL**

Nx monorepo layering, hexagonal architecture, library-first
principle, and project placement rules. Violations break module boundaries and
create circular dependencies.

### 1.1 All Code MUST Live Under apps/, libs/, or tools/

**Impact: CRITICAL (prevents orphaned projects and broken Nx graph)**

The Nx project graph is the canonical map of the system. All code must live as TypeScript projects under `apps/`, `libs/`, or `tools/`. New `package.json` or `project.json` files outside these directories require an RFC.

| Directory | Role | Tag | Example |
|-----------|------|-----|---------|
| `apps/` | Thin deployable shells (composition roots) | `type:api` | `apps/guard-api` |
| `libs/` | Business logic, data access, shared utilities | `type:domain`, `type:data`, `type:util` | `libs/guard/ingestion/domain` |
| `tools/` | Dev-time tooling only (CLIs, generators) | `type:tool` | `tools/gcp-dev` |

**Incorrect (package.json in arbitrary location):**

```
project-root/
├── scripts/
│   └── package.json    ← NOT under apps/, libs/, or tools/
├── helpers/
│   └── package.json    ← NOT under apps/, libs/, or tools/
└── apps/
    └── guard-api/
```

**Correct (all projects under standard directories):**

```
project-root/
├── apps/
│   └── guard-api/          ← type:api
├── libs/
│   ├── guard/ingestion/
│   │   ├── domain/         ← type:domain
│   │   └── data/           ← type:data
│   └── shared/
│       └── observability/  ← type:util
└── tools/
    └── pg-external/        ← type:tool
```

Tools are for **dev-time only**: `type:tool` projects (CLIs, build helpers, code generators) live in `tools/`. Tools MAY depend on `libs/` but `apps/` and `libs/` MUST NOT depend on `type:tool` projects.

### 1.2 Product Features MUST Begin as Standalone Libraries

**Impact: CRITICAL (ensures modularity and testability)**

Every product feature (domain rules, use cases, API behavior beyond wiring, data modeling) MUST begin its existence as a standalone library in `libs/`. No product feature shall be implemented directly within application code without first being abstracted into a reusable library component.

Apps wire domain + data + shared libs — they do NOT contain business logic.

**Incorrect (business logic in app code):**

```typescript
// apps/guard-api/src/routes/events.ts
import { Router } from 'express';
import { db } from '../db.js';

const router = Router();
router.put('/events/:id', async (req, res) => {
  const hash = computeHash(req.body);
  const exists = await db.query('SELECT 1 FROM events WHERE hash = $1', [hash]);
  if (exists.rows.length) return res.status(409).json({ error: 'duplicate' });
  await db.query('INSERT INTO events ...', [req.body]);
  res.status(201).json({ ok: true });
});
```

**Correct (feature in lib, app is thin shell):**

```typescript
// libs/guard/ingestion/domain/src/event-ingestion.usecase.ts
export function ingestEvent(input: EventInput, deps: IngestDeps): IngestResult {
  const hash = computeEventHash(input);
  return { ...input, hash, bufferedAt: deps.clock.now() };
}

// apps/guard-api/src/routes/events.ts
import { ingestEvent } from '@turbi/guard-ingestion-domain';
import { RawEventsRepo } from '@turbi/guard-ingestion-data';

router.put('/events/:id', async (req, res) => {
  const result = ingestEvent(validated, { clock: systemClock });
  await repo.create(result);
  res.status(201).json({ ok: true });
});
```

**Exception:** CI/CD and build/release plumbing is exempt, but reusable logic within it MUST live in `tools/` or `libs/` and be tested.

### 1.3 Domain Libs Must Not Depend on Data/API/Infra/Tool

**Impact: CRITICAL (prevents circular dependencies and maintains clean architecture)**

Strict hexagonal/clean architecture: domain libs define interfaces (ports) and contain pure business logic. Data libs implement those interfaces (adapters). Apps compose everything together.

```
type:api (app)  →  type:domain (lib)  ←  type:data (lib)
                         ↑
                   type:util (shared)
```

| Layer | May depend on | MUST NOT depend on |
|-------|---------------|--------------------|
| `type:domain` | pure shared (`type:util`) only | data, api, infra, tool |
| `type:data` | domain, shared | apps, other bounded contexts |
| `type:api` (app) | domain, data, shared | — |
| `type:tool` | libs (any) | — (never depended upon by apps/libs) |
| `type:util` (shared) | nothing or other shared | domain-specific libs |

**Incorrect (domain imports from data layer):**

```typescript
// libs/guard/ingestion/domain/src/event-ingestion.usecase.ts
import { KyselyRawEventsRepo } from '@turbi/guard-ingestion-data';

export function ingestEvent(input: EventInput) {
  const repo = new KyselyRawEventsRepo();
  return repo.create(input);
}
```

**Correct (domain defines interface, data implements it):**

```typescript
// libs/guard/ingestion/domain/src/ports/event-repository.port.ts
export interface EventRepository {
  create(event: BufferedEvent): Promise<void>;
}

// libs/guard/ingestion/domain/src/event-ingestion.usecase.ts
export function ingestEvent(
  input: EventInput,
  deps: { repo: EventRepository; clock: Clock }
): Promise<void> {
  const buffered = bufferEvent(input, deps.clock.now());
  return deps.repo.create(buffered);
}

// libs/guard/ingestion/data/src/raw-events.repository.ts
import type { EventRepository } from '@turbi/guard-ingestion-domain';

export class KyselyRawEventsRepo implements EventRepository {
  async create(event: BufferedEvent): Promise<void> { /* Kysely insert */ }
}
```

### 1.4 Domain Libs Are Pure — No I/O, No Framework Deps

**Impact: CRITICAL (ensures testability and portability of business logic)**

Domain libraries (`type:domain`) contain pure business logic only. They MUST NOT have I/O operations (database, HTTP, file system) or framework dependencies (Express, Kysely, pg). Only `tslib` and pure utility libraries are allowed.

**Incorrect (domain lib with infrastructure dependencies):**

```json
{
  "name": "@turbi/guard-ingestion-domain",
  "dependencies": {
    "kysely": "^0.27.0",
    "express": "^4.18.0",
    "pg": "^8.12.0"
  }
}
```

**Correct (pure domain with injected dependencies):**

```json
{
  "name": "@turbi/guard-ingestion-domain",
  "dependencies": {
    "tslib": "^2.6.0"
  }
}
```

```typescript
import type { EventRepository } from './ports/event-repository.port.js';

export function ingestEvent(
  input: EventInput,
  deps: { repo: EventRepository; clock: Clock }
): IngestResult {
  const hash = computeEventHash(input);
  return { ...input, hash, bufferedAt: deps.clock.now() };
}
```

### 1.5 Apps Are Thin Composition Roots — No Business Logic

**Impact: CRITICAL (prevents monolithic apps and ensures reusability)**

Apps (`type:api`) are thin deployable shells that compose domain and data libs. They wire dependencies together, configure middleware, and define routes — but they MUST NOT contain business logic, domain rules, or data access code.

**Incorrect (business logic in app):**

```typescript
router.put('/events/:id', async (req, res) => {
  if (!req.body.environmentId) {
    return res.status(400).json({ code: 'MISSING_ENV_ID' });
  }
  const hash = crypto.createHash('sha256')
    .update(JSON.stringify(req.body)).digest('hex');
  const result = await pool.query('INSERT INTO events ...', [req.body]);
  res.status(201).json({ id: req.params.id });
});
```

**Correct (app wires libs together):**

```typescript
import { ingestEvent } from '@turbi/guard-ingestion-domain';
import { KyselyRawEventsRepo } from '@turbi/guard-ingestion-data';

export function createEventRoutes(deps: { repo: KyselyRawEventsRepo }) {
  const router = Router();
  router.put('/events/:id', async (req, res) => {
    const validated = validateRequest(req);
    const result = await ingestEvent(validated, {
      repo: deps.repo,
      clock: systemClock,
    });
    res.status(201).json(result);
  });
  return router;
}
```

---

## 2. Module System

**Impact: CRITICAL**

ESM-first configuration, import extensions, and avoiding CJS/ESM mixing. Violations cause runtime crashes or silent resolution failures.

### 2.1 package.json Must Have "type": "module"

**Impact: CRITICAL (prevents ESM/CJS conflicts and runtime crashes)**

Every `package.json` in the workspace (root and per-project) MUST declare `"type": "module"`. This ensures Node.js treats `.js` files as ESM by default.

**Incorrect:**

```json
{
  "name": "@turbi/guard-ingestion-domain",
  "version": "0.0.0",
  "private": true,
  "main": "./dist/src/index.js"
}
```

**Correct:**

```json
{
  "name": "@turbi/guard-ingestion-domain",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./dist/src/index.js",
  "types": "./dist/src/index.d.ts"
}
```

### 2.2 Must Include .js Extensions in ESM Imports

**Impact: CRITICAL (prevents ERR_MODULE_NOT_FOUND at runtime)**

In native ESM with `moduleResolution: "nodenext"`, Node.js requires explicit file extensions. Even though source files are `.ts`, TypeScript requires `.js` extensions.

**Incorrect:**

```typescript
import { foo } from './utils';
import { bar } from './helpers/validate';
```

**Correct:**

```typescript
import { foo } from './utils/index.js';
import { bar } from './helpers/validate.js';
```

Package imports (e.g., `import { Router } from 'express'`) are resolved via `exports` and do not need extensions.

### 2.3 Never Use require/module.exports — Always ESM

**Impact: CRITICAL (prevents CJS/ESM mixing and ERR_REQUIRE_ESM)**

All source and config files must use ESM syntax. Never use `require()` or `module.exports`.

**Incorrect:**

```typescript
const express = require('express');
module.exports = { createApp };
```

**Correct:**

```typescript
import express from 'express';
export { createApp };
```

For CJS-only dependencies: `import pkg from 'cjs-lib'; const { foo } = pkg;`

### 2.4 Use import.meta.url — Never Bare __dirname

**Impact: CRITICAL (prevents ReferenceError in ESM modules)**

ESM modules do not have `__dirname` or `__filename`. Use `import.meta.url` with `fileURLToPath`.

**Incorrect:**

```typescript
const workspaceRoot = path.resolve(__dirname, '../..');
```

**Correct:**

```typescript
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '../..');
```

`vitest.config.ts` MUST be in `tsconfig.spec.json`'s `include` array for `import.meta.url` to be recognized.

---

## 3. Build

**Impact: HIGH**

TypeScript project references, composite tsconfig, rootDir enforcement, and build ordering.

### 3.1 Referenced tsconfigs Must Have composite: true

**Impact: HIGH (prevents TS project reference compilation failures)**

Any tsconfig referenced by another MUST have `"composite": true`. In this workspace, `tsconfig.base.json` already sets it, so extending it inherits the setting.

**Incorrect:**

```json
{
  "extends": "../../../../tsconfig.base.json",
  "compilerOptions": {
    "composite": false
  }
}
```

**Correct:**

```json
{
  "extends": "../../../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "types": ["node"]
  },
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.spec.ts", "src/**/*.test.ts"]
}
```

### 3.2 Keep vitest.config.ts Out of tsconfig.lib.json

**Impact: HIGH (prevents "File is not under rootDir" errors)**

Since `tsconfig.lib.json` sets `rootDir: "./src"`, including files outside `src/` triggers a compilation error. `vitest.config.ts` belongs in `tsconfig.spec.json` only.

**Incorrect:**

```json
// tsconfig.lib.json
{
  "include": ["src/**/*.ts", "vitest.config.ts"]
}
```

**Correct:**

```json
// tsconfig.lib.json
{ "include": ["src/**/*.ts"], "exclude": ["src/**/*.spec.ts"] }

// tsconfig.spec.json
{ "include": ["vitest.config.ts", "src/**/*.test.ts", "src/**/*.spec.ts"] }
```

### 3.3 No Circular TypeScript Project References

**Impact: HIGH (prevents infinite compilation loops)**

If Project A references Project B, then B MUST NOT reference A. Extract shared code into a third package.

**Incorrect:**

```json
// domain/tsconfig.lib.json: references data
// data/tsconfig.lib.json: references domain  ← circular!
```

**Correct:**

```json
// domain/tsconfig.lib.json: references [] (leaf)
// data/tsconfig.lib.json: references [domain] (one-way)
```

### 3.4 Don't Modify tsconfig.base.json Without Reason

**Impact: HIGH (prevents workspace-wide compilation breakage)**

`tsconfig.base.json` defines shared settings inherited by all projects. Changes affect the entire workspace.

**Expected settings (do not change):**

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "target": "es2022",
    "customConditions": ["@nx/source"]
  }
}
```

Project-specific overrides go in `tsconfig.lib.json` or `tsconfig.spec.json`.

---

## 4. Linking

**Impact: HIGH**

npm workspaces linking, package.json exports field with @nx/source condition, dependency declarations, and symlink management.

### 4.1 Lib package.json Must Have exports with @nx/source

**Impact: HIGH (enables source-level resolution during dev/test)**

Every library's `package.json` MUST have an `exports` field with the `@nx/source` condition for source-level imports during development.

**Incorrect:**

```json
{
  "name": "@turbi/guard-ingestion-domain",
  "main": "./dist/src/index.js"
}
```

**Correct:**

```json
{
  "name": "@turbi/guard-ingestion-domain",
  "type": "module",
  "main": "./dist/src/index.js",
  "types": "./dist/src/index.d.ts",
  "exports": {
    "./package.json": "./package.json",
    ".": {
      "@nx/source": "./src/index.ts",
      "types": "./dist/src/index.d.ts",
      "import": "./dist/src/index.js",
      "default": "./dist/src/index.js"
    }
  }
}
```

### 4.2 Consumers Must Declare Workspace Dependencies

**Impact: HIGH (prevents "Cannot find module" errors at runtime)**

If a project imports `@turbi/foo`, its `package.json` MUST declare the dependency with `"*"` version.

**Incorrect:**

```json
{ "dependencies": { "express": "^4.18.0" } }
// @turbi/guard-ingestion-domain not listed but imported
```

**Correct:**

```json
{
  "dependencies": {
    "@turbi/guard-ingestion-domain": "*",
    "@turbi/guard-ingestion-data": "*",
    "express": "^4.18.0"
  }
}
```

Run `npm install` after adding new dependencies to regenerate symlinks.

### 4.3 Never Use file:, link:, or Relative Paths

**Impact: HIGH (prevents broken resolution and non-portable configs)**

Workspace dependencies MUST use `"*"`. Never use `file:`, `link:`, or relative paths.

**Incorrect:**

```json
{ "@turbi/domain": "file:../../libs/guard/ingestion/domain" }
```

**Correct:**

```json
{ "@turbi/domain": "*" }
```

### 4.4 Never Use Root-Level TS Path Aliases for Workspace Libs

**Impact: HIGH (prevents TS/runtime resolution mismatch)**

Do not use `paths` in `tsconfig.base.json` for workspace packages. Rely on npm workspaces + `@nx/source`.

**Incorrect:**

```json
{ "paths": { "@turbi/*": ["libs/*/src"] } }
```

**Correct:**

```json
{ "customConditions": ["@nx/source"] }
```

Combined with npm workspaces symlinks and `exports` in each lib's `package.json`.

### 4.5 Root Workspaces Array Must Cover All Project Folders

**Impact: HIGH (prevents missing symlinks)**

Every folder containing a project `package.json` MUST be covered by a workspaces glob.

**Correct:**

```json
{
  "workspaces": [
    "apps/*",
    "libs/*",
    "libs/guard/ingestion/*",
    "libs/shared/*",
    "libs/testkit/*",
    "tools/*"
  ]
}
```

After adding a new package: run `npm install` to regenerate symlinks.

---

## 5. Testing

**Impact: HIGH**

Vitest configuration with workspace-root pattern, test-first methodology, testing pyramid, and deterministic test requirements.

### 5.1 Set Vitest Root to Workspace Root

**Impact: HIGH (prevents module resolution failures in npm workspaces)**

In npm workspaces, `node_modules` lives at the workspace root. Always set Vitest `root` to workspace root and scope `include` to the project.

**Incorrect:**

```typescript
export default defineConfig({
  test: { include: ['src/**/*.spec.ts'] },
});
```

**Correct (depth=4 lib):**

```typescript
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '../../../..');

export default defineConfig({
  root: workspaceRoot,
  test: {
    include: [
      'libs/guard/ingestion/domain/src/**/*.spec.ts',
      'libs/guard/ingestion/domain/src/**/*.test.ts',
    ],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage/libs/guard/ingestion/domain',
    },
  },
});
```

### 5.2 Use import.meta.url Pattern in vitest.config.ts

**Impact: HIGH (required for ESM path resolution)**

Every `vitest.config.ts` must use `import.meta.url` to compute workspace root. `__dirname` is not available in ESM.

```typescript
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '../../../..');
```

`vitest.config.ts` MUST be in `tsconfig.spec.json`'s `include` array.

### 5.3 Use Workspace-Relative Include Paths

**Impact: HIGH (ensures correct test discovery)**

Since `root` is workspace root, `include` must use workspace-relative paths.

**Incorrect:**

```typescript
include: ['src/**/*.spec.ts']  // resolves to <workspace>/src/**
```

**Correct:**

```typescript
include: ['libs/guard/ingestion/domain/src/**/*.spec.ts']
```

### 5.4 Tests MUST Be Written Before Implementation

**Impact: HIGH (ensures correctness and prevents untested code)**

NON-NEGOTIABLE: test-first mindset (Red-Green-Refactor).

1. Write tests for intended behavior
2. Confirm tests FAIL (Red)
3. Implement until tests PASS (Green)
4. Refactor while tests stay green

### 5.5 Testing Pyramid — Unit, Integration, E2E

**Impact: HIGH (ensures appropriate coverage at each layer)**

| Layer | Location | Coverage |
|-------|----------|----------|
| Unit | Colocated `*.test.ts` | Pure logic, use cases |
| Integration | `test/integration/*.integration.test.ts` | Controller → usecase → real DB |
| E2E | Separate project | Critical flows only |

Vitest is the standard runner. No Jest for Nx projects.

### 5.6 Tests Must Be Deterministic

**Impact: HIGH (prevents flaky tests and unreliable CI)**

- No live network calls (except local containers)
- Time and randomness controlled via dependency injection
- Database tests use Testcontainers with real PostgreSQL
- Test setup/teardown leaves no shared state

**Incorrect:**

```typescript
const response = await fetch('https://api.example.com/users/1');
```

**Correct:**

```typescript
const fakeClock = { now: () => new Date('2026-01-01T12:00:00Z') };
const token = createToken({ clock: fakeClock });
expect(token.expiresAt).toEqual(new Date('2026-01-01T12:30:00Z'));
```

---

## 6. Tags

**Impact: MEDIUM**

Nx project tags (scope/type/bc), module boundary enforcement, and dependency constraint rules.

### 6.1 Every Project MUST Have scope + type Tags

**Impact: MEDIUM (enables module boundary enforcement)**

Every Nx project MUST have at least `scope:*` and `type:*` tags in `project.json`.

| Dimension | Examples | Purpose |
|-----------|----------|---------|
| `scope:<x>` | `scope:guard`, `scope:shared` | Product boundary |
| `type:<x>` | `type:domain`, `type:data`, `type:api`, `type:util`, `type:tool` | Architectural layer |
| `bc:<x>` | `bc:ingestion`, `bc:risk` | Bounded context |

**Examples:**

```json
// Domain lib
{ "tags": ["npm:private", "scope:guard", "bc:ingestion", "type:domain"] }

// App
{ "tags": ["scope:guard", "type:api", "release:app"] }

// Shared utility
{ "tags": ["npm:private", "scope:shared", "type:util"] }
```

### 6.2 Tags Must Obey Hexagonal Dependency Rules

**Impact: MEDIUM (prevents architectural erosion)**

The `@nx/enforce-module-boundaries` lint rule enforces the dependency matrix:

| Source tag | Can depend on | MUST NOT depend on |
|------------|---------------|--------------------|
| `type:domain` | `type:util` | `type:data`, `type:api`, `type:tool` |
| `type:data` | `type:domain`, `type:util` | `type:api`, `type:tool` |
| `type:api` | `type:domain`, `type:data`, `type:util` | `type:tool` |
| `type:tool` | `type:domain`, `type:data`, `type:util` | — |

Run `nx lint <project>` to verify compliance. This is a CI quality gate.

---

## 7. Boundaries

**Impact: MEDIUM**

Safe-by-default external call patterns, typed clients, input validation with Zod, no `any` on public surfaces, and structured domain errors.

### 7.1 External Calls Must Use Typed Clients with Timeouts

**Impact: MEDIUM (prevents unbounded I/O and silent failures)**

Every external call (HTTP, queues, databases) MUST be time-bound and go through shared abstractions. Use `AbortController`/`AbortSignal` for timeout control.

**Incorrect:**

```typescript
const response = await fetch(`https://api.example.com/users/${id}`);
const data = await response.json();
return data;
```

**Correct:**

```typescript
const controller = new AbortController();
const timeout = setTimeout(this.timeoutMs).then(() => controller.abort());

const response = await fetch(`${this.baseUrl}/users/${id}`, {
  signal: controller.signal,
});
if (!response.ok) {
  throw new ExternalServiceError({ code: 'USER_API_ERROR', status: response.status });
}
return response.json() as Promise<User>;
```

### 7.2 Inputs Must Be Validated at Boundaries (Zod)

**Impact: MEDIUM (prevents invalid data from entering the domain)**

Inputs from external systems MUST be validated at the boundary using Zod or similar. Use `safeParse` for graceful error handling.

**Incorrect:**

```typescript
const event = req.body;
const result = await ingestEvent(event, deps);
```

**Correct:**

```typescript
const parsed = EventInputSchema.safeParse(req.body);
if (!parsed.success) {
  return res.status(400).json({ code: 'VALIDATION_ERROR', errors: parsed.error.flatten() });
}
const result = await ingestEvent(parsed.data, deps);
```

### 7.3 Public TypeScript Surfaces Must Have Explicit Types — No any

**Impact: MEDIUM (prevents type safety erosion)**

`any` is never allowed on public APIs. Use `unknown` when flexibility is needed.

**Incorrect:**

```typescript
export function processEvent(event: any): any { /* ... */ }
```

**Correct:**

```typescript
export function processEvent(event: ValidatedEventInput): ProcessedEvent { /* ... */ }
```

### 7.4 Errors Must Use Stable Codes and Standard Structures

**Impact: MEDIUM (enables programmatic error handling)**

Domain errors use stable `code` fields. HTTP failures use standard `{ code, message, details? }` structure.

**Incorrect:**

```typescript
throw new Error('Event validation failed');
```

**Correct:**

```typescript
throw new DomainError(
  'EVENT_VALIDATION_FAILED',
  'Event payload missing required fields',
  { missingFields: ['environmentId'] }
);
```

---

## 8. Observability

**Impact: MEDIUM**

Structured JSON logging, OpenTelemetry instrumentation for tracing and metrics, and PII/secret redaction.

### 8.1 Logging Must Be Structured JSON

**Impact: MEDIUM (enables machine parsing, filtering, and alerting)**

All logging MUST be structured JSON with contextual fields. No string concatenation or template literals.

**Incorrect:**

```typescript
console.log('Processing event ' + eventId);
```

**Correct:**

```typescript
logger.info({ eventId, environmentId }, 'Processing event');
```

### 8.2 OpenTelemetry Is Standard for Tracing and Metrics

**Impact: MEDIUM (ensures consistent observability)**

OpenTelemetry is the standard. All services must initialize the OTel SDK. Observability instrumentation is part of the definition of done.

```typescript
// Import OTel before anything else
import './otel-init.js';
import express from 'express';
```

### 8.3 Secrets and Tokens Must Be Redacted from Logs

**Impact: MEDIUM (prevents credential leakage)**

Secrets, tokens, passwords, API keys, and PII MUST be redacted from all logs and telemetry.

**Incorrect:**

```typescript
logger.info({ headers: req.headers }, 'Incoming request');
```

**Correct:**

```typescript
logger.info(
  { contentType: req.headers['content-type'], method: req.method, path: req.path },
  'Incoming request'
);
```

Use pino's `redact` option to catch accidental leaks:

```typescript
const logger = pino({
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', '*.password', '*.token'],
    censor: '[REDACTED]',
  },
});
```

---

## References

1. [Nx Documentation](https://nx.dev/docs)
2. [Nx — TypeScript Project Linking](https://nx.dev/docs/concepts/typescript-project-linking)
3. [Nx — Enforce Module Boundaries](https://nx.dev/features/enforce-module-boundaries)
4. [TypeScript — Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
5. [Vitest Documentation](https://vitest.dev/guide/)
6. [Node.js — ESM](https://nodejs.org/api/esm.html)
7. [npm Workspaces](https://docs.npmjs.com/cli/using-npm/workspaces)
8. [OpenTelemetry JS](https://opentelemetry.io/docs/languages/js/)
