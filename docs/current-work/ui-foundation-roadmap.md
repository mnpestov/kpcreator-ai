# UI Foundation Roadmap

## Goal

Transform KP Creator from a single-purpose commercial proposal generator
into a scalable operational platform for catering and event management.

The goal is NOT a full redesign.

The goal is:
- establish scalable UI foundations
- improve desktop UX
- standardize navigation and layouts
- support future modules without future redesigns
- preserve incremental development workflow

---

# Current Problems

## Visual Problems

- oversized desktop UI
- giant buttons and header
- inconsistent spacing
- weak visual hierarchy
- mobile-first sizing on desktop
- inconsistent forms and tables

## UX Problems

- poor navigation structure
- no persistent application shell
- no back navigation
- profile page UX issues
- unclear action hierarchy
- fragmented page experience

## Architectural Problems

Current UI is built around isolated pages.

Future roadmap requires:
- multi-module navigation
- reusable entity management
- operational workflows
- scalable layout architecture

---

# Product Direction

KP Creator is evolving into:

- CRM-lite
- event operations platform
- catering workflow system
- document generation platform

Future modules include:
- contractors directory
- menu directory
- equipment directory
- foodtruck/mobile kitchen directory
- employee directory
- event calendar
- workflow pipeline
- document lifecycle
- commercial proposal templates

---

# UI/UX Principles

## 1. Incremental Evolution

Avoid:
- full rewrites
- framework migrations
- complete redesigns

Prefer:
- progressive stabilization
- minimal diffs
- backwards compatibility
- reusable foundations

---

## 2. Desktop-First Operational UX

Primary usage is desktop operational work.

UI should prioritize:
- dense but readable layouts
- fast navigation
- reduced vertical waste
- efficient workflows

Mobile remains supported but secondary.

---

## 3. Consistency Over Decoration

Focus on:
- spacing consistency
- predictable controls
- reusable patterns
- visual hierarchy

Avoid:
- overdesigned UI
- excessive animations
- decorative complexity

---

## 4. Scalable Navigation

Navigation must support future modules.

Target structure:

- Dashboard
- Commercial Proposals
- Events
- Directories
- Documents
- Settings

---

# Target UI Architecture

## Application Shell

Introduce persistent app layout:

- sidebar navigation
- topbar
- content container
- breadcrumbs
- contextual actions

---

## Layout System

Standardize:
- max-width containers
- spacing scale
- page padding
- section spacing
- responsive breakpoints

---

## Design Tokens

Introduce reusable tokens:

### Spacing
- xs
- sm
- md
- lg
- xl

### Typography
- page title
- section title
- body
- caption

### Radius
- small
- medium
- large

### Elevation
- card
- modal
- dropdown

---

# Component Standardization

Create reusable primitives:

- Button
- Input
- Select
- Modal
- Table
- Card
- PageHeader
- StatusBadge
- EmptyState
- Loader

Important:
No massive component library migration.

Use lightweight internal abstractions only.

---

# Navigation Strategy

## Sidebar Navigation

Future modules require sidebar-based navigation.

Sidebar should support:
- grouped sections
- icons
- collapsible behavior
- active states

---

## Page Header Pattern

Each page should support:
- title
- subtitle
- breadcrumbs
- primary action
- secondary actions

---

# Workflow UX

Future workflow states:

- Draft
- Proposal Sent
- Approved
- Awaiting Event
- Preparation
- Procurement
- Event In Progress
- Completed
- Closed

UI must support:
- status badges
- timeline views
- kanban/pipeline
- calendar visualization

---

# Planned Modules

## Phase 1 — UI Foundation

Goal:
Establish scalable UI infrastructure.

Includes:
- app shell
- sidebar
- responsive layout
- button sizing system
- typography system
- spacing system

---

## Phase 2 — Navigation & UX

Includes:
- breadcrumbs
- page headers
- back navigation
- dashboard improvements
- profile page redesign

---

## Phase 3 — Entity Directories

Includes:
- contractors
- employees
- equipment
- menu items
- foodtrucks

Shared features:
- CRUD
- search
- filters
- tags
- statuses

---

## Phase 4 — Event Workflow

Includes:
- event calendar
- workflow statuses
- operational pipeline
- event lifecycle

---

## Phase 5 — Document System

Includes:
- proposal templates
- reusable blocks
- document statuses
- approval flow

---

# Technical Constraints

Must preserve:
- existing backend APIs
- existing PDF generation
- Zustand migration path
- current deployment flow

Avoid:
- breaking changes
- framework rewrites
- large refactors

---

# Development Workflow

Preferred workflow:
- small incremental PRs
- build after changes
- isolated UI passes
- minimal scope edits

Avoid:
- broad autonomous rewrites
- unrelated refactors
- large-scale visual rewrites

---

# Immediate Priorities

1. Stabilize current UI
2. Reduce oversized desktop elements
3. Introduce application shell
4. Improve profile UX
5. Standardize buttons/forms/tables
6. Prepare navigation for future modules