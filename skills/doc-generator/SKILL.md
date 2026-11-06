---
name: doc-generator
description: "Generates professional PDF business documents (like purchase orders, invoices, and requests for quotation) from user-provided data. Handles data collection, validation, and PDF generation via a schema-driven CLI tool. Use this skill whenever the user mentions creating, generating, or sending any of: purchase order, PO, invoice, bill, request for quotation, RFQ, or any formal commercial document for goods or services, even if phrased casually ('make a PO for Acme', 'need to invoice a client', 'bill someone for work done', 'write up a purchase order', 'send an RFQ for our product', 'request a quote from a supplier'). This skill manages the full workflow: collecting required fields, applying smart defaults, building the JSON payload, running the CLI, and presenting the PDF path and key figures"
---

# doc-generator

Claude's operating instructions for generating business documents using the doc-generator CLI. Covers trigger conditions, data collection per document type, CLI invocation, and result presentation

## Trigger Conditions

Invoke this skill when the user asks to **create, generate, or produce** any of the supported document types. Trigger on any of:

- "generate a purchase order / PO"
- "create an invoice / bill"
- "make a PO for [vendor]"
- "send an invoice to [client] for [work]"
- "I need a purchase order for [items]"
- "generate a request for quotation / RFQ"
- "create an RFQ for [product]"
- "send an RFQ to [vendor]"
- "request a quote for [items]"
- Any phrasing that implies creating a formal commercial document for goods or services

### Do NOT trigger when

- The user is asking about a document they have received (they want to parse or read it, not generate it).
- The user wants to edit an existing PDF that was already generated.
- The user is asking a general question about POs or invoices without wanting to create one.

## Supported Document Types

| `doc_type` slug | Human name | Required fields (minimum) |
| --- | --- | --- |
| `purchase_order` | Purchase Order | `po_number`, `buyer.name`, `buyer.address`, `vendor.name`, `vendor.address`, at least 1 line item with `description`, `quantity`, `unit_price` |
| `invoice` | Invoice | `invoice_number`, `issuer.name`, `issuer.address`, `bill_to.name`, `bill_to.address`, at least 1 line item with `description`, `quantity`, `unit_price` |
| `request_for_quotation` | Request for Quotation (RFQ) | `rfq_number`, `issuer.name`, `product_name`, at least 1 spec section with at least 1 row |

If the user requests a document type not in this table, inform them it is not yet supported and list what is available.

## Reference Files

Before collecting data for any doc type, read the corresponding reference file from the project root:

| Doc type | Reference file |
| --- | --- |
| `purchase_order` | `references/purchase_order.md` |
| `invoice` | `references/invoice.md` |
| `request_for_quotation` | `references/request_for_quotation.md` |

Each reference file is the source of truth for: all fields (required/optional) with when-to-ask guidance, service line handling, payment status rules (invoice), validation rules, and payload construction notes including a minimal shape and field encoding.

## Universal Rules

### Computed fields — never ask

The following fields are **always calculated by the tool**. Never ask the user for them. Never include them in the payload.

| Computed field | Available on |
| --- | --- |
| `line_items[n].total` | `purchase_order`, `invoice` |
| `subtotal` | `purchase_order`, `invoice` |
| `tax_amount` | `purchase_order`, `invoice` |
| `grand_total` | `purchase_order`, `invoice` |
| `total_units` | `purchase_order`, `invoice` |
| `balance_due` | `invoice` only |

**`request_for_quotation` has no computed fields.** It contains no monetary values — all context is purely descriptive.

### Smart defaults — apply silently

Apply these without asking the user:

| Field | Default | Notes |
| --- | --- | --- |
| `issue_date` | today (`YYYY-MM-DD`) | All doc types |
| `currency` | `USD` | `purchase_order`, `invoice` only |
| `tax_rate` | `0.00` | `purchase_order`, `invoice` only |
| `shipping_cost` | `0.00` | `purchase_order`, `invoice` only |
| `paid` | `false` | `invoice` only |
| `amount_paid` | `0.00` | `invoice` only |

### Document numbering

If the user has not provided a document number, **suggest one** based on the current date:

- PO: `PO-YYYY-NNNN` (e.g. `PO-2026-0001`)
- Invoice: `INV-YYYY-NNNN` (e.g. `INV-2026-0001`)
- RFQ: `RFQ-YYYY-NNNN` (e.g. `RFQ-2026-0001`)

Ask the user to confirm the suggested number before generating.

### Ask for required fields in one pass

Identify all missing required fields and ask for them together. Do not ask field by field in separate turns.

### Confirm before generating

Once all required data is collected, show a brief summary and ask for confirmation before running the CLI:

- **PO / Invoice:** document type, number, parties, number of line items, grand total if calculable
- **RFQ:** document type, number, issuer, product name, number of spec sections, total number of spec rows

## Invocation

### 1. Write the payload to a temp file

Construct the complete JSON payload from the collected data. Write it to a temporary file. Do not include any computed fields in the JSON.

Example payload path: `/tmp/doc_payload_<timestamp>.json`

### 2. Run the CLI

```bash
cd ~/doc-generator && DYLD_LIBRARY_PATH=/opt/homebrew/lib uv run python scripts/generate.py \
  --doc_type <doc_type_slug> \
  --payload <path_to_payload_file>
```

**Do not pass `--preview`** when running as a skill (the user will open the file themselves).

### 3. Capture stdout and exit code

- **Exit code 0:** stdout contains the output file path (e.g. `output/purchase_order_20260316_0001.pdf`). Generation succeeded.
- **Exit code 1:** stdout contains an error message. Generation failed.

## Output Presentation

### On success

Tell the user:

1. The document was generated successfully.
2. The output path (make it clickable or easy to copy).
3. A one-line summary of key figures or structure.

Example response (PO):
> Purchase Order **PO-2026-0001** generated successfully.
> Output: `output/purchase_order_20260316_0001.pdf`
> Grand total: $2,728.50 (75 units · Net 30 · FedEx Ground)

Example response (RFQ):
> Request for Quotation **RFQ-2026-0001** generated successfully.
> Output: `output/request_for_quotation_20260316_0001.pdf`
> Product: Level Off · 2 spec sections · 13 rows

### On success with partial payment (invoice)

Highlight both grand total and balance due:
> Invoice **INV-2026-0001** generated.
> Output: `output/invoice_20260316_0001.pdf`
> Grand total: $3,410.00 · Amount paid: $825.00 · **Balance due: $2,585.00**

### On unknown doc_type

> That document type is not currently supported. Supported types: `purchase_order`, `invoice`, `request_for_quotation`.

## Validation Error Relay

If the CLI exits with code 1, stdout contains a structured error from Pydantic in this format:

```text
Validation failed:
  field_name: error message
  nested.field: error message
```

**Do not show the raw error output directly.** Translate it into plain language for the user:

| Raw error pattern | User-facing message |
| --- | --- |
| `field → must not be empty` | "The [field label] is required and cannot be blank." |
| `must be greater than zero` | "Quantity and unit price must be greater than zero." |
| `tax_rate → must be between 0.0 and 1.0` | "Tax rate must be a decimal between 0 and 1 (e.g. `0.08` for 8%)." |
| `delivery_date must be on or after issue_date` | "The delivery date cannot be before the issue date." |
| `due_date must be on or after issue_date` | "The due date cannot be before the issue date." |
| `must contain at least one line item` | "At least one line item is required." |
| `valid_until must be after issue_date` | "The quote-by date must be after the issue date." |
| `spec_sections must contain at least one entry` | "At least one specification section with at least one row is required." |

After presenting the error, ask the user to correct the problematic values and offer to regenerate.
