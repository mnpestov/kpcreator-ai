# Event Frontend Foundation

## Goal

Implement the frontend CRUD foundation
for operational event management.

This phase introduces:
- event list
- event creation
- event editing
- event details

without introducing calendar complexity yet.

---

# Objectives

The Event module should become:
- a stable operational entity
- connected to contractors
- future-compatible with KP workflow
- compatible with future calendar views

---

# Scope

## Event List Page

Route:
```txt id="40bdz7"
/events
```

Features:
- compact operational table
- event date
- title
- contractor
- status
- location

Support:
- loading state
- empty state
- responsive layout

---

## Event Create/Edit Form

Routes:
```txt id="8r5m72"
/events/new
/events/:id/edit
```

Fields:
- title
- contractor
- eventDate
- startTime
- endTime
- location
- status
- notes

Requirements:
- compact operational layout
- mobile-friendly stacking
- contractor dropdown
- optional notes section

---

## Event Details Page

Route:
```txt id="16g51k"
/events/:id
```

Display:
- event summary
- contractor
- timing
- location
- status
- notes

No timeline/workflow UI yet.

---

# Statuses

Initial statuses:
- Draft
- Approved
- Preparation
- Scheduled
- Completed
- Cancelled

Do NOT implement:
- workflow engine
- transition validation
- kanban board

---

# Navigation

Add:
```txt id="8g3hmo"
События
```

to sidebar navigation.

---

# UI Constraints

Prefer:
- dense operational UI
- compact tables
- restrained spacing
- mobile compatibility

Avoid:
- dashboard-style cards
- oversized controls
- decorative UI
- calendar widgets

---

# Technical Constraints

Avoid:
- global state rewrites
- React Query migration
- generic CRUD abstractions
- workflow frameworks

Prefer:
- explicit pages
- lightweight forms
- incremental integration

---

# Future Compatibility

This foundation should later support:
- calendar views
- KP linking
- employee assignments
- equipment planning
- procurement workflows
- operational analytics