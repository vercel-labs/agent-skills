# State Recipes

Copy-paste `agent-browser` recipes for the states a feature must handle. Replace
URLs, selectors, and expected text with the app's real values. Every recipe ends
by reading or screenshotting the result — the result is the test, not the action.

## Happy path

```bash
agent-browser open https://localhost:3000/feature
agent-browser wait --load networkidle
agent-browser snapshot                         # read the page before acting
agent-browser find role button click --name "Create"
agent-browser wait --text "Created"
agent-browser get text "[role=status]"         # assert the exact confirmation
agent-browser screenshot                        # success-state.png
```

## Empty state

Reach a genuinely empty view — a fresh account, or a filter that matches
nothing. Verify it is an intentional empty state, not a blank page or a crash.

```bash
agent-browser open https://localhost:3000/items?filter=none-match
agent-browser wait --load networkidle
agent-browser get text "body"                  # expect an empty-state message, not ""
agent-browser is visible "text=No items yet"   # or the app's real empty copy
agent-browser screenshot
```

## Loading state

Capture the page in the instant before data arrives. If the loading UI is too
fast to catch, that is worth noting — but a spinner that *never* resolves is a
bug.

```bash
agent-browser open https://localhost:3000/slow-feature
agent-browser screenshot                        # immediately: should show skeleton/spinner
agent-browser wait --text "Expected content"    # then it must resolve
agent-browser screenshot                        # resolved state
# Confirm the spinner is gone, not stuck:
agent-browser wait "[aria-busy=true]" --state hidden
```

## Error state

Mock a failed response with `network route`, then trigger the request. Confirm
the app shows a real error message rather than a blank screen, a stuck spinner,
or a thrown exception.

```bash
agent-browser network route "**/api/**" --body '{"error":"Service unavailable"}'
# (use --abort instead to simulate a hard request failure)
agent-browser reload
agent-browser wait --load networkidle
agent-browser get text "body"                  # expect a visible error message
agent-browser screenshot                        # error-state.png
agent-browser network unroute                   # always clean up the route
```

## Unauthorized

Hit a protected view without valid auth and confirm it blocks or redirects —
it must not render protected content or crash.

```bash
agent-browser cookies clear                     # drop the session
agent-browser open https://localhost:3000/account/settings
agent-browser wait --load networkidle
agent-browser get url                           # expect redirect to /login (or a 403 view)
agent-browser screenshot
```

## Offline / network failure

Toggle offline and retry an action. The app should surface a failure and stay
usable — not hang forever.

```bash
agent-browser set offline on
agent-browser find role button click --name "Refresh"
agent-browser wait --text "offline"            # or the app's real failure copy
agent-browser screenshot
agent-browser set offline off                   # restore connectivity
```

## Modal / dialog interaction

Open a dialog, confirm it appears, act inside it, confirm it closes and the
underlying action took effect.

```bash
agent-browser find role button click --name "Delete"
agent-browser wait --text "Are you sure"
agent-browser is visible "[role=dialog]"        # dialog is open
agent-browser find role button click --name "Confirm"
agent-browser wait "[role=dialog]" --state hidden  # dialog closed
agent-browser get text "[role=status]"          # the action's result is visible
```

## Responsive / device

Re-run a flow at a mobile viewport (or an emulated device) to catch layout and
touch-target breakage that only appears on small screens.

```bash
agent-browser set device "iPhone 14"
# or: agent-browser set viewport 375 812
agent-browser open https://localhost:3000/feature
agent-browser wait --load networkidle
agent-browser screenshot --full                 # full-page mobile capture
agent-browser is visible "text=Expected element"
```

## Form validation

Submit invalid input and confirm the field-level error is shown — empty,
wrong-type, and boundary values, not just a valid submission.

```bash
agent-browser find label "Email" fill "not-an-email"
agent-browser find role button click --name "Submit"
agent-browser get text "[aria-invalid=true] ~ *, [role=alert]"  # expect a validation message
agent-browser screenshot
```
