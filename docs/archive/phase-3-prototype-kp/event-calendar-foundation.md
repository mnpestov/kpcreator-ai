# Event Calendar Foundation

## Goal

Introduce the foundational event management system
that becomes the operational core of KP Creator.

Events will connect:
- commercial proposals
- contractors
- employees
- equipment
- menu
- workflow statuses
- future operational planning

This phase focuses ONLY on foundational event architecture.

---

# MVP Scope

## Included

### Event Entity
Basic event model with:
- title
- customer/contractor
- event date
- start time
- end time
- location
- status
- notes

---

## Event List Page

Operational list view:
- upcoming events
- searchable table
- compact layout
- status indicators

---

## Calendar View

Basic monthly calendar:
- event markers
- clickable events
- current month navigation

No advanced drag/drop behavior yet.

---

## Event Details Page

Includes:
- event summary
- status
- quick edit access

---

## Event Create/Edit Form

Fields:
- title
- contractor
- date/time
- location
- notes
- status

---

# Excluded

Do NOT implement yet:
- workflow engine
- kanban
- procurement logic
- task system
- notifications
- recurring events
- equipment assignment
- employee scheduling

These belong to future phases.

---

# Event Statuses

Initial statuses:

- Draft
- Approved
- Preparation
- Scheduled
- Completed
- Cancelled

Status system should remain lightweight.

---

# Navigation

Sidebar:
Events

Routes:
- `/events`
- `/events/calendar`
- `/events/new`
- `/events/:id`
- `/events/:id/edit`

---

# UI Rules

Must reuse:
- AppLayout
- PageContainer
- PageHeader
- CRUD patterns

Use:
- compact operational layouts
- subtle status indicators
- dense event tables

---

# Calendar Rules

Calendar should:
- remain lightweight
- prioritize readability
- support mobile responsiveness

Avoid:
- heavy calendar frameworks
- drag/drop complexity
- animation-heavy interactions

---

# Technical Constraints

Must preserve:
- current routing architecture
- existing UI foundation
- current backend conventions

Avoid:
- overengineering workflow logic
- premature scheduling engines
- global state complexity

---

# Future Compatibility

This foundation must support future:
- operational workflow pipeline
- procurement planning
- employee assignment
- equipment assignment
- kanban workflows
- analytics
- notifications

without requiring architecture redesign.