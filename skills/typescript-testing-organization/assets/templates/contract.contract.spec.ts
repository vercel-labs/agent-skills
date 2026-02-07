/**
 * Contract Test Template
 *
 * Tier: Contract
 * Suffix: *.contract.spec.ts
 * Placement: test/contract/<provider-or-consumer>.contract.spec.ts
 *
 * Principles:
 * - Validate that stubs/fakes match real provider/consumer behavior
 * - Verify cross-service assumptions and schema compliance
 * - Typically scheduled (nightly/weekly), not on every PR
 * - MSW handlers are stubs/fakes — not expectation-driven mocks
 *
 * See: tdd-classicist/references/taxonomy-test-tiers.md (contract tier)
 * See: typescript-testing-organization/references/style-guidance.md (scenario tiers)
 */

import { describe, it, expect } from "vitest";

// import { paymentApiHandlers } from '../_support/msw/payment-api.msw';
// import { setupServer } from 'msw/node';
// import { PaymentClient } from '../../src/clients/payment-client';

describe("Contract: Payment API", () => {
  // const server = setupServer(...paymentApiHandlers);

  // beforeAll(() => server.listen());
  // afterEach(() => server.resetHandlers());
  // afterAll(() => server.close());

  describe("given a valid charge request", () => {
    it("POST /charges returns 201 with charge_id and status", async () => {
    // Act — call the real client against the MSW stub
    // const result = await paymentClient.createCharge({
    //   amount: 1000,
    //   currency: 'usd',
    // });

    // Assert — schema/contract compliance
    // expect(result).toMatchObject({
    //   charge_id: expect.any(String),
    //   status: expect.stringMatching(/^(succeeded|pending)$/),
    //   amount: 1000,
    //   currency: 'usd',
    // });
    });
  });

  describe("given an invalid currency", () => {
    it("POST /charges returns 400 with INVALID_CURRENCY", async () => {
      // Act
      // const result = await paymentClient.createCharge({
      //   amount: 1000,
      //   currency: 'invalid',
      // });

      // Assert — error contract
      // expect(result.error.code).toBe('INVALID_CURRENCY');
    });
  });

  // Validate that your MSW handlers match the real API:
  // - Response shapes match the provider's schema
  // - Error codes match the provider's documentation
  // - Edge cases (rate limits, timeouts) are represented
});
