# Contractors Directory — Implementation Plan

## Goal

Implement the first production CRUD module
using the new KP Creator UI foundation,
navigation architecture,
and CRUD patterns.

This module validates:
- CRUD architecture
- reusable layouts
- routing scalability
- operational workflows

---

# Scope

## Included

### Contractors List Page
- searchable table
- compact operational layout
- create contractor button
- edit/delete actions

### Contractor Create/Edit Form
Fields:
- company name
- contact person
- phone
- email
- notes

### Contractor Details Page
- contractor summary
- edit action

---

## Excluded

- attachments
- tags
- statuses
- permissions
- pagination
- audit logs
- activity feed
- advanced filtering

---

# Navigation

Sidebar:
Operations → Contractors

Routes:
- `/contractors`
- `/contractors/new`
- `/contractors/:id`
- `/contractors/:id/edit`

---

# UI Rules

Must use:
- AppLayout
- PageContainer
- PageHeader
- CRUD patterns
- compact tables
- responsive forms

---

# Table Rules

Columns:
- Company
- Contact Person
- Phone
- Email
- Actions

Desktop:
- dense operational layout

Mobile:
- stacked readable rows

---

# Form Rules

Desktop:
- 2-column layout allowed

Mobile:
- stacked layout

Actions:
- Save
- Cancel
- Delete (future)

---

# Technical Constraints

Must preserve:
- current routing architecture
- current app shell
- existing backend conventions

Avoid:
- overengineering abstractions
- generic CRUD frameworks
- premature optimization
- global state complexity

---

# Future Compatibility

This module should become
the reference implementation for:
- employees
- equipment
- menu
- foodtrucks

Future CRUD modules should reuse
the same UX and architectural patterns.