# Current Stable State

## Goal

This document captures the current stable architectural baseline
of KP Creator after the Event ↔ KP lightweight linking phase.

Purpose:

* prevent architectural drift
* preserve implementation direction
* align future AI-assisted development
* document stabilized domain boundaries

This document is NOT:

* a roadmap
* a brainstorming document
* a future architecture proposal

This is:

* the current stable snapshot of the system.

---

# Current Product Direction

KP Creator is evolving from:

```txt
Commercial proposal generator
```

into:

```txt
Operational event management platform
```

using:

* incremental evolution
* minimal diffs
* stabilization-first development

---

# Current Stable Modules

The following modules/features are considered stable:

## Authentication

* login/logout
* protected routes
* auth persistence
* header/sidebar rendering

---

## UI Foundation

* persistent application shell
* sidebar navigation
* compact operational layout
* responsive structure
* mobile navigation fixes

---

## KP Module

* KP create/edit/view
* preview rendering
* PDF generation
* latest KP list
* history rendering
* form reset stabilization

---

## Contractors Module

* full CRUD
* contractor directory
* contractor dropdown integration
* contractor persistence

---

## Events Module

* Event CRUD
* Event details
* contractor integration
* operational event entity

---

## Event ↔ KP Linking

Implemented as:

* lightweight reference relationship
* nullable association
* explicit linking only

Verified stable:

* KP without Event
* KP with Event
* Event unlink flow
* Event deletion via SET NULL
* old KP compatibility
* Preview null safety

---

# Current Domain Model

## KP

Represents:

* commercial proposal
* estimation
* pricing
* negotiation

KP answers:

```txt
What should be sold?
How much will it cost?
```

---

## Event

Represents:

* operational execution
* scheduling
* logistics
* preparation

Event answers:

```txt
What operationally must happen?
```

---

# Official Business Flow

```txt
KP
↓
Approval / Agreement
↓
Event
↓
Execution
```

KP remains:

* the primary business entry point.

---

# Current Relationships

## KP

Relationships:

* belongsTo Contractor
* belongsTo Event (nullable)

---

## Event

Relationships:

* belongsTo Contractor
* hasMany KP

---

# Architectural Constraints

## Do NOT Introduce

* workflow engines
* synchronization systems
* orchestration layers
* bidirectional entity sync
* mirrored operational state
* shared domain stores
* generic CRUD abstractions
* React Query migration
* large-scale Zustand rewrites
* background relationship automation

---

# Event ↔ KP Relationship Rules

Current implementation is:

* reference-only

Allowed:

* optional linking
* lightweight includes
* compact linked entity rendering

NOT allowed:

* automatic synchronization
* field mirroring
* live propagation
* workflow transitions
* approval orchestration

---

# CRUD Philosophy

Preferred:

* explicit controllers
* explicit pages
* explicit forms
* localized component state
* readable implementation

Avoid:

* schema-driven CRUD
* generic form builders
* universal CRUD frameworks
* dynamic abstractions

---

# UI/UX Philosophy

Preferred:

* compact operational UI
* desktop-first workflows
* dense readable layouts
* predictable navigation
* lightweight forms

Avoid:

* oversized controls
* dashboard-heavy layouts
* decorative complexity
* unnecessary animations

---

# Stabilization Learnings

Previous regressions included:

* auth state desync
* stale Zustand form state
* contractor persistence issues
* JSX hierarchy crashes
* mobile sidebar breakage
* form hydration bugs

Because of this:

Preferred implementation strategy:

* minimal diffs
* incremental rollout
* localized fixes
* backward compatibility
* verification-first changes

---

# Current Roadmap

Current implementation trajectory:

1. UI Foundation
2. CRUD Foundation
3. Contractors
4. Events
5. Event ↔ KP lightweight linking
6. Stabilization pass
7. Playwright smoke foundation
8. Operational workflows later

---

# Current Technical Direction

Preferred:

* incremental architecture
* explicit relationships
* lightweight operational UX
* production-safe evolution

Avoid:

* autonomous architecture rewrites
* premature scalability systems
* speculative abstractions
* future-proof overengineering

---

# Verification Status

Verified stable:

* Event ↔ KP nullable linking
* unlink flow
* SET NULL behavior
* old KP compatibility
* Preview rendering
* Event details linked KP rendering
* frontend build
* backend relationship loading

---

# Next Planned Milestone

Next planned milestone:

```txt
Minimal Playwright smoke foundation
```

Purpose:

* regression prevention
* operational stability
* critical flow verification

NOT intended for:

* full QA automation
* heavy testing infrastructure
* CI redesign
* coverage-driven development

---

# Final Principle

KP Creator should continue evolving through:

```txt
small stable increments
```

NOT through:

* large rewrites
* premature abstractions
* workflow overengineering
* synchronization complexity
