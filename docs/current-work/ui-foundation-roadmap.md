# UI Foundation Roadmap

## Goal

Transform KP Creator from a single-purpose commercial proposal generator
into a scalable operational platform for catering and event management.

The goal is NOT a full redesign.

The goal is:

* establish scalable UI foundations
* improve desktop UX
* standardize navigation and layouts
* support future modules without future redesigns
* preserve incremental development workflow

IMPORTANT:
The project follows:

* incremental architecture
* stabilization-first development
* explicit implementation
* lightweight operational workflows

Avoid:

* premature ERP complexity
* orchestration-heavy systems
* workflow engine architecture

---

# Current Product Direction

KP Creator is evolving into:

```txt id="m5f1l4"
Operational Catering CRM
```

NOT:

* enterprise ERP
* SAP-style orchestration platform
* Bitrix clone

The system should remain:

* lightweight
* operational
* explicit
* maintainable

---

# Current Problems

## Visual Problems

* oversized desktop UI
* giant buttons and header
* inconsistent spacing
* weak visual hierarchy
* mobile-first sizing on desktop
* inconsistent forms and tables

---

## UX Problems

* poor navigation structure
* no persistent application shell
* no back navigation
* profile page UX issues
* unclear action hierarchy
* fragmented page experience

---

## Architectural Problems

Current UI originally evolved around isolated pages.

Future roadmap requires:

* multi-module navigation
* reusable operational patterns
* scalable layout architecture
* directory management
* operational visibility

IMPORTANT:
Future scaling should happen through:

* incremental evolution
* lightweight references
* modular CRUD growth

NOT through:

* orchestration systems
* synchronization engines
* massive rewrites

---

# Product Evolution

KP Creator is evolving into:

* CRM-lite
* event operations platform
* catering workflow platform
* document generation system

Future modules include:

* contractors directory
* menu directory
* equipment directory
* fleet/mobile kitchen directory
* employee directory
* operational calendar
* lightweight workflow visibility
* proposal templates

---

# UI/UX Principles

## 1. Incremental Evolution

Avoid:

* full rewrites
* framework migrations
* complete redesigns
* architecture resets

Prefer:

* progressive stabilization
* minimal diffs
* backwards compatibility
* reusable foundations
* explicit implementation

---

## 2. Desktop-First Operational UX

Primary usage is:

* desktop operational work.

UI should prioritize:

* dense but readable layouts
* fast navigation
* reduced vertical waste
* efficient workflows
* compact operational visibility

Mobile remains:

* supported
* stabilized
* secondary

---

## 3. Consistency Over Decoration

Focus on:

* spacing consistency
* predictable controls
* reusable patterns
* operational clarity
* visual hierarchy

Avoid:

* overdesigned UI
* excessive animations
* decorative complexity
* dashboard-heavy aesthetics

---

## 4. Scalable Navigation

Navigation must support future operational modules.

Target structure:

* Dashboard
* Commercial Proposals
* Events
* Directories
* Documents
* Settings

---

# Target UI Architecture

## Application Shell

Persistent app layout includes:

* sidebar navigation
* topbar
* content container
* contextual actions

Avoid:

* deep nested routing complexity
* overengineered shell systems

---

## Layout System

Standardize:

* max-width containers
* spacing scale
* page padding
* section spacing
* responsive breakpoints

Goal:

* operational consistency
* predictable layouts
* scalable CRUD pages

---

## Design Tokens

Introduce lightweight reusable tokens.

### Spacing

* xs
* sm
* md
* lg
* xl

### Typography

* page title
* section title
* body
* caption

### Radius

* small
* medium
* large

### Elevation

* card
* modal
* dropdown

IMPORTANT:
Avoid introducing:

* massive design systems
* enterprise UI frameworks
* heavy theming architecture

---

# Component Standardization

Reusable primitives may include:

* Button
* Input
* Select
* Modal
* Table
* Card
* PageHeader
* StatusBadge
* EmptyState
* Loader

IMPORTANT:
No massive component-library migration.

Prefer:

* lightweight internal abstractions
* localized reuse
* explicit components

Avoid:

* universal UI frameworks
* generic mega-components
* abstraction-heavy component systems

---

# Navigation Strategy

## Sidebar Navigation

Sidebar should support:

* grouped sections
* icons
* active states
* lightweight collapsible behavior

Goal:

* fast operational navigation
* scalable module access

---

## Page Header Pattern

Each page should support:

* title
* subtitle
* primary action
* secondary actions

Avoid:

* overcomplicated header orchestration
* dynamic action engines

---

# Workflow Visibility Philosophy

IMPORTANT:
Workflow visibility does NOT mean:
workflow engine architecture.

The project currently prefers:

* lightweight manual statuses
* explicit operational state
* human-driven workflows

Avoid:

* orchestration engines
* automated state propagation
* lifecycle automation
* synchronized domain transitions

---

# Future Operational States

Potential future states:

* Draft
* Proposal Sent
* Approved
* Awaiting Event
* Preparation
* Procurement
* Event Active
* Completed
* Closed

IMPORTANT:
Statuses should remain:

* explicit
* lightweight
* manual
* operationally visible

NOT:

* automated
* rule-engine driven
* workflow-orchestrated

---

# Visualization Layer

Future UI may include:

* status badges
* timeline views
* operational boards
* calendar visualization

IMPORTANT:
These are:

* visibility layers

NOT:

* orchestration systems
* workflow engines

---

# Planned Modules

## Phase 1 — UI Foundation

✅ largely completed

Includes:

* app shell
* sidebar
* responsive layout
* button sizing stabilization
* typography stabilization
* spacing stabilization

---

## Phase 2 — Navigation & UX

✅ mostly stabilized

Includes:

* page structure
* navigation improvements
* profile stabilization
* operational layout consistency

---

## Phase 3 — Operational Directories

Current priority:

* Menu / Dishes Directory

Reason:
Menu data is currently partially hardcoded inside KP creation flow.

The goal is:

* remove hardcoded commercial presets
* centralize reusable menu items
* improve KP creation UX
* preserve editable commercial snapshots

IMPORTANT:
This is NOT:

* inventory management
* recipe engine
* procurement system
* food-cost platform

This is:

* lightweight commercial menu directory only.

---

### Menu / Dishes Directory

Minimal V1 model:

```txt id="l3lx5d"
MenuItem
- title
- description
- category
- weight (nullable)
- price (nullable)
- active
```

Examples:

* burgers
* coffee drinks
* desserts
* catering sets
* street food items

Category may initially remain:

* lightweight string/select field

NOT:

* separate entity system

---

### KP Integration Philosophy

Menu directory acts as:

```txt id="5d24wa"
commercial preset source
```

KP rows remain:

```txt id="v3lsiw"
editable commercial snapshots
```

IMPORTANT:
After selecting a MenuItem inside KP:

* title remains editable
* description remains editable
* type/category remains editable
* weight remains editable
* price remains editable

KP data must remain independent
from future Menu changes.

Avoid:

* synchronization logic
* automatic propagation
* linked live updates

---

### Menu UX Direction

Inside Product Popup:

Add:

* MenuItem selector/autocomplete

After selection:

* autofill title
* autofill description
* autofill category
* optionally autofill weight
* optionally autofill price

All fields remain manually editable.

---

### Menu Directory Scope Restrictions

Do NOT introduce:

* recipe systems
* ingredient trees
* nested menu composition
* modifiers engine
* stock tracking
* warehouse logic
* procurement workflows
* automatic price updates

Avoid:

* ERP-style food systems
* synchronization complexity
* operational automation

---

## Phase 4 — Additional Operational Directories

After Menu stabilization:

* equipment
* fleet/mobile units

These should follow:

* existing CRUD patterns
* lightweight operational architecture
* reference-only linking

---

## Phase 5 — Operational Calendar

Future milestone.

Scope:

* event visualization
* operational scheduling visibility
* calendar navigation

Avoid:

* resource planning engines
* conflict resolution systems
* drag-and-drop orchestration
* scheduling automation

---

## Phase 6 — Workflow Visibility

Future milestone.

Includes:

* lightweight statuses
* operational progress visibility
* manual workflow transitions

Avoid:

* BPM systems
* enterprise workflow engines
* automation-heavy lifecycle systems

---

## Phase 7 — Employees Directory

Deferred until:

* operational staffing workflows
* real usage validation
* UX research completion

Reason:
Catering staffing often relies on:

* temporary event-based workers
* dynamic staffing pools
* operational flexibility

Current employee workflows
require further product research
before architecture implementation.

Avoid:

* premature staffing systems
* scheduling engines
* payroll complexity

---

## Phase 8 — Document System

Includes:

* proposal templates
* reusable blocks
* document statuses

Avoid:

* dynamic template engines
* inheritance systems
* complex approval orchestration


---

# Current Architecture Constraints

Must preserve:

* existing backend APIs
* existing PDF generation
* Zustand stability
* current deployment flow
* lightweight CRUD architecture

Avoid:

* breaking changes
* framework rewrites
* synchronization systems
* orchestration layers
* large-scale refactors

---

# Testing Strategy Alignment

Current project testing philosophy:

* lightweight Playwright smoke coverage
* operational workflow validation
* stable selectors
* low-maintenance tests

Avoid:

* enterprise QA architecture
* page object overengineering
* abstraction-heavy test systems

---

# Development Workflow

Preferred workflow:

* small incremental PRs
* build after changes
* isolated stabilization passes
* minimal scope edits
* explicit implementation

Avoid:

* broad autonomous rewrites
* unrelated refactors
* speculative abstractions
* large-scale visual rewrites

---

# Immediate Recommended Priorities

1. Employees Directory
2. Equipment Directory
3. Fleet/Mobile Units Directory
4. Menu/Dishes Directory
5. Operational Calendar
6. Lightweight Workflow Visibility

IMPORTANT:
Continue evolving through:

```txt id="pklw42"
small stable increments
```

NOT through:

* enterprise architecture jumps
* orchestration complexity
* premature automation
