# Sections

This file defines all sections, their ordering, impact levels, and descriptions.
The section ID (in parentheses) is the filename prefix used to group rules.

---

## 1. Architecture (arch)

**Impact:** CRITICAL  
**Description:** Nx monorepo layering, hexagonal architecture, library-first
principle, and project placement rules. Violations break module boundaries and
create circular dependencies.

## 2. Module System (esm)

**Impact:** CRITICAL  
**Description:** ESM-first configuration, import extensions, and avoiding
CJS/ESM mixing. Violations cause runtime crashes or silent resolution failures.

## 3. Build (build)

**Impact:** HIGH  
**Description:** TypeScript project references, composite tsconfig, rootDir
enforcement, and build ordering. Violations cause compilation failures or stale
type declarations.

## 4. Linking (linking)

**Impact:** HIGH  
**Description:** npm workspaces linking, package.json exports field with
@nx/source condition, dependency declarations, and symlink management.
Violations cause "Cannot find module" errors.

## 5. Testing (testing)

**Impact:** HIGH  
**Description:** Vitest configuration with workspace-root pattern, test-first
methodology, testing pyramid, and deterministic test requirements.

## 6. Tags (tags)

**Impact:** MEDIUM  
**Description:** Nx project tags (scope/type/bc), module boundary enforcement,
and dependency constraint rules.

## 7. Boundaries (boundaries)

**Impact:** MEDIUM  
**Description:** Safe-by-default external call patterns, typed clients, input
validation with Zod, no `any` on public surfaces, and structured domain errors.

## 8. Observability (observability)

**Impact:** MEDIUM  
**Description:** Structured JSON logging, OpenTelemetry instrumentation for
tracing and metrics, and PII/secret redaction.
