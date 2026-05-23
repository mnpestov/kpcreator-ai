# CRUD Patterns

## Goal

Standardize CRUD UX and layout behavior across all directory modules.

The goal is:
- predictable user experience
- reusable UI patterns
- scalable operational workflows
- reduced implementation complexity

All future directories should follow the same structure.

---

# Supported Modules

Current and future CRUD modules:

- Contractors
- Employees
- Equipment
- Menu
- Foodtrucks
- Future operational entities

---

# Standard CRUD Structure

Each module should contain:

## 1. List Page
Purpose:
Overview and operational management.

Includes:
- page header
- create action
- filters
- search
- sortable table
- pagination (future)
- bulk actions (future)

---

## 2. Details Page
Purpose:
Entity overview and related information.

Includes:
- entity summary
- status
- related documents/events
- quick actions
- edit action

---

## 3. Create/Edit Page
Purpose:
Entity creation and editing.

Includes:
- standardized form layout
- grouped sections
- sticky actions area
- validation feedback
- breadcrumbs

---

# List Page Pattern

## Header Structure

PageHeader:
- title
- subtitle
- primary action button

Example:
Employees
Manage operational staff and assignments.

[ Add Employee ]

---

## Filter Bar

Filter bar should support:
- search input
- status filter
- category filter
- reset filters

Avoid:
- oversized filter areas
- modal filters

---

## Table Rules

Tables should:
- prioritize readability
- support dense operational workflows
- use consistent spacing
- use subtle borders

Avoid:
- oversized rows
- decorative cards replacing tables

---

## Row Actions

Preferred:
- inline lightweight actions
- contextual menu (future)

Avoid:
- giant action buttons
- duplicated actions

---

# Create/Edit Form Pattern

## Form Structure

Forms should use:
- logical sections
- section titles
- compact spacing
- responsive grids

---

## Form Sections

Example:
- General Information
- Contact Information
- Operational Details
- Attachments

---

## Form Actions

Desktop:
- actions aligned right

Mobile:
- full-width stacking allowed

Primary action:
- Save

Secondary actions:
- Cancel
- Delete (danger)

---

# Details Page Pattern

## Layout

Top:
- title
- status
- quick actions

Middle:
- entity details

Bottom:
- related records

---

# Search & Filtering Rules

Search should:
- be persistent
- support partial matches
- remain lightweight

Filters should:
- remain visible
- avoid deep nested controls
- preserve operational speed

---

# Empty States

Every CRUD module should support:
- empty list state
- no search results state
- loading state
- error state

---

# Status System

Future entities may support statuses.

Standard status colors:
- active
- inactive
- pending
- archived
- warning

Avoid:
- custom status styles per module

---

# Responsive Rules

Desktop:
- dense layouts
- tables prioritized

Mobile:
- stacked layouts
- simplified actions
- readable spacing

---

# Future Compatibility

CRUD patterns must support future:
- permissions
- role-based actions
- audit history
- attachments
- activity logs
- bulk operations

without redesigning UX patterns.