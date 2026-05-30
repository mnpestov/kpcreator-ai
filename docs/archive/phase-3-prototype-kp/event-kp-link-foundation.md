# Event ↔ KP Link Foundation

## Goal

Introduce the foundational relationship
between:
- Events
- Commercial Proposals (KP)

without implementing synchronization
or workflow automation yet.

---

# Domain Strategy

## KP
Represents:
- commercial proposal
- estimation
- negotiation

## Event
Represents:
- operational execution
- logistics
- scheduling

KP remains the primary business entry point.

---

# Relationship Model

## Initial Phase

One Event may optionally reference:
- one primary KP

One KP may optionally reference:
- one Event

Relationship remains lightweight.

---

# Current Objective

Support:
- linking KP to Event
- creating Event from KP
- attaching KP to existing Event

without introducing synchronization logic.

---

# UX Direction

Inside KP flow:

User can:
- create new Event
OR
- attach KP to existing Event

---

# Event Creation Strategy

When creating Event from KP:
- copy operational fields once
- Event becomes independent operational entity

No live synchronization between entities.

---

# Avoided Complexity

Do NOT implement:
- two-way synchronization
- live field mirroring
- workflow engines
- event orchestration systems
- multi-KP event aggregation yet

---

# Shared Fields

Potentially duplicated temporarily:
- contractor
- dates
- timing
- location
- notes

Long-term operational source of truth:
- Event

Commercial source of truth:
- KP

---

# Technical Constraints

Avoid:
- architecture rewrites
- generic relationship frameworks
- automatic sync systems

Prefer:
- explicit linking
- lightweight relations
- incremental evolution

---

# Future Compatibility

This foundation should later support:
- multiple KP per Event
- procurement planning
- employee assignments
- logistics coordination
- calendar integration
- operational analytics