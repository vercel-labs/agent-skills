# Quick reference: Error Reporting log ingestion fields

When ingesting from **Cloud Logging**, Error Reporting looks for stack traces in:

- multi-line `textPayload`, or
- `jsonPayload` fields, especially:
  - `stack_trace`
  - `exception`
  - `message`

## Field evaluation order (jsonPayload)

If multiple fields are present, the evaluation order is:

1. `stack_trace`
2. `exception`
3. `message`

If `message` is evaluated and non-empty, a stack trace is captured only if `message` contains a
stack trace in a supported format.

## For text-only events (no stack trace)

If you only want to report a text message (no stack trace), shape the payload as a
`ReportedErrorEvent` by setting:

- `jsonPayload["@type"] =
  "type.googleapis.com/google.devtools.clouderrorreporting.v1beta1.ReportedErrorEvent"`
- `jsonPayload.message = "..."` (required)

If `@type` is not set, Cloud Logging may look for `serviceContext` to detect a ReportedErrorEvent
payload.

## See also

- [LogEntry formatting rules](../../references/logentry-formatting.md)
