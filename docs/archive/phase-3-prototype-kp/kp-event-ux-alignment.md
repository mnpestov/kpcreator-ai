# KP ↔ Event UX Alignment

## Goal

Align the user experience
with the established KP-first domain strategy.

Prevent KP and Event
from feeling like unrelated duplicate entities.

---

# Problem

Currently:
- KP can be created independently
- Event can be created independently
- there is no visible operational connection

This creates UX confusion and duplicates operational intent.

---

# UX Direction

KP remains:
- the primary business entry point

Event becomes:
- operational execution entity

---

# Planned UX

Inside KP flow:

User should be able to:
- create Event automatically
OR
- attach KP to existing Event

---

# Initial UX Bridge

Add lightweight Event relation section
inside KP form.

Example:

```txt
[✓] Create Event automatically

or

[ ] Link to existing Event
    [ Event dropdown ]
```

---

# Important Constraints

Do NOT implement:
- synchronization
- live mirroring
- workflow engine
- automatic updates between entities

This phase is UX alignment only.

---

# Strategic Goal

Users should naturally understand:

```txt
KP
↓
Event
```

instead of perceiving them
as duplicated independent modules.