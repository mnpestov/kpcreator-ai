# Testing Strategy

## Goal

This document defines the testing philosophy
for KP Creator.

The project follows:

* stabilization-first development
* incremental architecture
* lightweight operational testing

Testing exists to:

* prevent regressions
* validate critical workflows
* protect stabilized architecture

Testing does NOT exist to:

* drive architecture
* maximize coverage percentages
* introduce enterprise QA complexity

---

# Current Testing Philosophy

Preferred approach:

```txt id="qmqx9n"
minimal operational smoke coverage
```

Focus:

* critical user flows
* business-critical operations
* architecture stability

Avoid:

* overengineering
* premature QA systems
* abstraction-heavy testing

---

# Current Testing Layers

## 1. Manual Verification

Still important for:

* UX validation
* responsive behavior
* operational workflow review
* PDF output review

---

## 2. Playwright Smoke Tests

Purpose:

* fast regression detection
* critical flow validation
* operational stability

Smoke suite should remain:

* fast
* explicit
* readable
* low-maintenance

---

# What Smoke Tests Cover

Current coverage focuses on:

## Authentication

* login flow
* protected routes
* app shell rendering

---

## KP Workflows

* KP creation
* product/list interaction
* preview rendering
* save flow

---

## Events Workflows

* Event creation
* Event editing
* Event details

---

## Relationships

* Event ↔ KP linking during creation
* relationship rendering

---

# What Smoke Tests SHOULD NOT Cover

Avoid:

* exhaustive edge-case coverage
* visual-perfect assertions
* implementation details
* animation timing
* pixel validation
* internal state testing

Smoke tests validate:

* operational functionality

NOT:

* internal implementation.

---

# Selector Strategy

Preferred:

* data-testid
* stable identifiers
* explicit automation hooks

Avoid:

* fragile text matching
* DOM hierarchy traversal
* nth-child selectors
* CSS-dependent selectors

Good:

```js id="rjzjlwm"
page.getByTestId('kp-save-button')
```

Bad:

```js id="1r7m0k"
page.locator('.form > div:nth-child(4) button')
```

---

# Test Design Philosophy

Preferred:

* explicit readable tests
* localized logic
* direct workflows
* operational realism

Avoid:

* generic helper frameworks
* page object overengineering
* dynamic entity factories
* hidden test orchestration

Good:

```js id="p2b0wa"
await page.getByTestId('event-title').fill('Smoke Event')
```

Bad:

```js id="f9w6p9"
await createEntity({
  type: 'event'
})
```

---

# Architectural Constraints

Tests must NOT:

* dictate architecture
* force routing redesign
* require workflow rewrites
* introduce persistence hacks

Product architecture always has priority over tests.

If tests expose:

* missing workflows
* implicit product limitations
* architectural boundaries

those discoveries should be documented,
NOT hidden.

---

# Important Current Limitation

Current product architecture does NOT support:

```txt id="76w2rd"
editing KP header fields after creation
```

This includes:

* event reassignment
* contractor reassignment
* header metadata editing

This is:

* a known architectural boundary
* not a bug
* not a testing issue

Future editable KP header workflows
must become:

* a dedicated roadmap milestone

NOT:

* a quick smoke-test workaround

---

# Future Testing Evolution

Future evolution may include:

## Additional Smoke Coverage

* contractors
* PDF generation
* dashboard navigation
* row/list persistence

---

## Later Optional Expansion

Only after architecture stabilization:

* lightweight CI integration
* broader regression coverage
* API smoke validation

Avoid:

* enterprise QA systems
* heavy testing orchestration
* premature complexity

---

# Final Principle

Testing should evolve through:

```txt id="88e11i"
small stable increments
```

NOT through:

* massive testing infrastructure
* enterprise QA overengineering
* abstraction-heavy frameworks

---

# Smoke Data Policy

Playwright smoke tests intentionally operate
against persistent local development data.

Because of this:
smoke-created entities must remain identifiable.

---

# Smoke Entity Naming

Smoke-created entities should use:

```txt id="jlwm105"
[SMOKE]
```

prefixes whenever possible.

Examples:

```txt id="jlwm106"
[SMOKE] Event Test
[SMOKE] Burger
[SMOKE] Contractor
```

Purpose:

* simplify debugging
* simplify cleanup
* prevent operational confusion
* avoid accidental reuse

---

# Cleanup Strategy

Preferred cleanup approach:

```txt id="jlwm107"
explicit cleanup scripts
```

Example:

```bash id="jlwm108"
npm run cleanup:smoke
```

Cleanup scripts may remove:

* smoke events
* smoke menu items
* smoke contractors
* smoke KP records

using:

* title/name prefixes
* explicit smoke markers

---

# Avoid Heavy Test Infrastructure

Do NOT introduce:

* isolated test databases
* transactional rollback systems
* Dockerized test environments
* automatic DB resets
* snapshot restoration systems

Current project scale does not justify:
enterprise QA infrastructure.

---

# Smoke Philosophy

Smoke tests should remain:

* lightweight
* operational
* readable
* debuggable

Persistent smoke data is acceptable
as long as:

* it is clearly identifiable
* cleanup remains simple
