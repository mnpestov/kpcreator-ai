# KP ↔ Event Domain Strategy

## Goal

Define the long-term operational relationship
between:
- Commercial Proposals (KP)
- Events

This document establishes the primary business flow
for the platform and prevents future domain duplication.

---

# Core Domain Principle

KP and Event are NOT the same entity.

## KP
Represents:
- commercial estimation
- proposal
- pricing
- negotiation stage

KP answers:
```txt
What should be sold?
How much will it cost?
```

---

## Event

Represents:
- operational execution
- scheduling
- preparation
- logistics
- staffing
- production lifecycle

Event answers:
```txt
What must actually happen operationally?
```

---

# Primary Business Flow

The primary workflow should be:

```txt
KP
↓
Approval / Agreement
↓
Event creation
↓
Operational execution
```

NOT:

```txt
Event
↓
Separate KP creation
```

KP remains the main business entry point.

---

# UX Strategy

## Preferred Flow

Inside KP creation/editing:

User can:
- create a new Event automatically
OR
- attach KP to an existing Event

---

# Event Linking Modes

## Mode 1 — Create New Event
(default)

When KP is approved/saved:
- automatically create Event
- transfer operational fields from KP

---

## Mode 2 — Attach To Existing Event

User selects:
- upcoming Event
- Draft / Approved / Preparation statuses only

KP becomes linked to existing Event.

---

# Shared Operational Fields

The following fields conceptually belong to Event:

- contractor
- eventDate
- startTime
- endTime
- location
- notes

KP may temporarily duplicate these fields
for operational convenience during the transition phase.

Long-term source of truth should become Event.

---

# Avoided Architecture

Do NOT:
- fully duplicate Event and KP forms
- maintain two independent operational datasets
- create synchronization logic between duplicated fields

This leads to:
- inconsistency
- stale data
- workflow conflicts
- maintenance complexity

---

# Future Domain Model

## Initial Phase

```txt
Contractor
    ↓
KP
```

---

## Operational Phase

```txt
Contractor
    ↓
Event
    ↓
KP
```

---

## Advanced Phase

```txt
Contractor
    ↓
Event
    ├── KP
    ├── Employees
    ├── Equipment
    ├── Procurement
    └── Logistics
```

---

# Event Lifecycle

Future operational statuses:

- Draft
- Approved
- Preparation
- Scheduled
- In Progress
- Completed
- Cancelled

Workflow engine is OUT OF SCOPE for current phase.

---

# Current Recommendation

Continue building:
- Event CRUD foundation
- Event operational entity
- lightweight Event ↔ KP linking

Do NOT implement:
- calendar-first architecture
- kanban systems
- workflow automation
- synchronization engines

until the core domain model stabilizes.

---

# Strategic Goal

Transform the application from:
```txt
Commercial proposal generator
```

into:
```txt
Operational event management platform
```

through incremental domain evolution.