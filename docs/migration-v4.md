# Migration Guide from v3 to v4

## Node.js Runtime

The action now runs on Node.js v24. Ensure your self-hosted runners support this version.

## Input Changes

### Removed Options

The following options, deprecated in v3, have been removed:

- `wait-seconds-before-first-polling`: Use `warmup-delay` (ISO 8601 duration) instead.
- `min-interval-seconds`: Use `minimum-interval` (ISO 8601 duration) instead.

### Changed Defaults

- `warmup-delay`: Default changed from `PT10S` to `PT1S`.
- `minimum-interval`: Default changed from `PT15S` to `PT10S`.

### Default Event Filtering

`event-list` is now introduced and defaults to `[ "${{ github.event_name }}" ]`.
This means by default, the action only waits for jobs triggered by the same event type (e.g., a `push` event only waits for other `push` event jobs).
If you want to wait for jobs triggered by any event, set `event-list: '[]'`.

### `startupGracePeriod` format

The key-value object format (e.g., `{"seconds": 30}`) is no longer supported in `wait-list`. Use ISO 8601 duration strings (e.g., `"PT30S"`) instead.

### `eventName` to `eventNames`

In `wait-list` and `skip-list`, `eventName` (string) is deprecated. Use `eventNames` (array of strings) instead.
Currently, `eventName` still works but will be removed in a future version.

## JSON Parsing

JSON inputs (like `wait-list` or `skip-list`) now support comments and trailing commas.
