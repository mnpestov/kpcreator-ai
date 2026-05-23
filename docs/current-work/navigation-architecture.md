# Navigation Architecture

## Goal

Define scalable navigation architecture for KP Creator
as the product evolves from a commercial proposal generator
into a full operational catering/event management platform.

The goal is:
- predictable navigation
- scalable module structure
- fast operational workflows
- future-proof layout organization

---

# Navigation Principles

## 1. Desktop-First Operational Navigation

Primary workflow is desktop usage.

Navigation should prioritize:
- fast access
- low click count
- persistent context
- operational efficiency

Mobile navigation remains supported but secondary.

---

## 2. Persistent Application Shell

The application uses:
- persistent sidebar
- compact topbar
- shared page header
- consistent content containers

Users should never feel like they are navigating isolated pages.

---

## 3. Scalable Module Hierarchy

Navigation must support future modules
without redesigning the layout structure.

---

# Target Navigation Structure

## Dashboard

Purpose:
Operational overview and quick access.

Future widgets:
- upcoming events
- recent proposals
- pending actions
- notifications
- quick create actions

Routes:
- `/`
- `/dashboard`

---

## Commercial Proposals

Purpose:
Create and manage commercial proposals.

Routes:
- `/kp`
- `/kp/new`
- `/kp/:id`
- `/kp/templates`

Future features:
- proposal templates
- approval statuses
- versioning
- PDF history

---

## Events

Purpose:
Manage event lifecycle and scheduling.

Routes:
- `/events`
- `/events/calendar`
- `/events/:id`

Future features:
- calendar view
- kanban workflow
- event statuses
- preparation tracking

---

## Directories

Purpose:
Reusable operational entities.

Submodules:
- Contractors
- Employees
- Equipment
- Menu
- Foodtrucks

Routes:
- `/directories/contractors`
- `/directories/employees`
- `/directories/equipment`
- `/directories/menu`
- `/directories/foodtrucks`

Shared behaviors:
- CRUD
- search
- filters
- tags
- statuses

---

## Documents

Purpose:
Operational and generated documents.

Future document types:
- proposals
- acts
- invoices
- attachments

Routes:
- `/documents`
- `/documents/:id`

---

## Settings

Purpose:
User and system configuration.

Routes:
- `/settings/profile`
- `/settings/security`
- `/settings/preferences`

Future features:
- roles
- permissions
- team management

---

# Sidebar Architecture

## Sidebar Goals

Sidebar should:
- remain compact
- support grouped navigation
- scale to future modules
- preserve operational speed

---

## Sidebar Sections

### Main
- Dashboard
- Commercial Proposals
- Events

### Operations
- Contractors
- Employees
- Equipment
- Menu
- Foodtrucks

### Documents
- Documents
- Templates

### System
- Settings
- Profile

---

## Sidebar Behavior

Desktop:
- fixed sidebar
- collapsible
- active route highlighting

Mobile:
- collapsible drawer
- horizontal fallback navigation allowed initially

---

# Topbar Architecture

## Purpose

Topbar should contain:
- user info
- profile access
- quick actions
- notifications (future)

Avoid:
- large navigation menus
- oversized buttons
- crowded layouts

---

# Breadcrumbs Strategy

Every major page should support breadcrumbs.

Example:
Dashboard / Events / Summer Festival 2026

Goals:
- maintain orientation
- support deep workflows
- improve navigation clarity

---

# Page Header Strategy

Each page should support:
- title
- subtitle
- primary action
- secondary actions
- contextual controls

Examples:
- Create Proposal
- Export PDF
- Add Employee
- Schedule Event

---

# Future Workflow Navigation

Future workflow statuses:
- Draft
- Sent
- Approved
- Awaiting Event
- Preparation
- Procurement
- In Progress
- Completed
- Closed

Navigation must eventually support:
- kanban views
- calendar views
- filtered workflow lists
- status-based quick access

---

# CRUD Navigation Rules

All directory modules should follow consistent UX:

## List Page
- filters
- search
- table/grid
- create action

## Details Page
- entity info
- related events/documents
- edit actions

## Edit/Create Page
- standardized form layout
- sticky actions
- breadcrumbs

---

# Navigation Constraints

Avoid:
- route rewrites
- deep nested navigation
- modal-heavy navigation flows
- hidden actions

Prefer:
- predictable routes
- shallow hierarchy
- reusable layouts
- consistent action placement

---

# Future Compatibility

This architecture must support:
- multi-user workflows
- permissions
- operational pipelines
- notifications
- analytics
- dashboards
- additional modules

without requiring future navigation redesign.