# Backlog & Priorities

This document tracks upcoming engineering, UX, and technical debt tasks, strictly prioritized from P1 (Critical) to P5 (Maintenance).

### P1 (Critical / Active)
- [x] **Event ↔ Contractor consistency modal**
  - *Context:* Implement conflict detection during KP save. If an Event's original Contractor differs from the newly selected Contractor, show a confirmation modal allowing the user to either "Keep" the original link or "Replace" it and securely update the Event's `contractorId`.

### P2 (High Priority Fixes)
- [x] **MKAD inversion bug**
  - *Context:* The logistics calculation logic for "Within MKAD" versus "Outside MKAD" is currently inverted or evaluating incorrectly under certain conditions. This causes inaccurate total cost calculations. Needs investigation into the `logisticsMeta.hasMkad` boolean logic and its corresponding pricing multipliers in `PrototypeKp.js`.
- [x] **Checkbox → Switch migration**
  - *Context:* The legacy `@skbkontur/react-ui` Checkbox components used for boolean toggles (like `isMultiDay` and `hasMkad`) are visually inconsistent with the modern, mobile-first design language of `PrototypeKp`. Migrate these to a custom `<Switch />` toggle component for a native operational UX.
- [x] **Zero weight category calculation bug**
  - *Context:* The `calculateKpTotal.js` ignores the entire row's price in category subtotals if the weight is missing or zero. This breaks PDF and Preview financial consistency while the total KP sum remains technically correct.

### P3 (Module Upgrades)
- [ ] **Organisation directory redesign**
  - *Context:* Update the Contractors list and details pages to match the new `PrototypeKp` aesthetics and design language. Remove legacy `@skbkontur/react-ui` components where they clash visually.

### P4 (Module Upgrades)
- [ ] **Menu directory redesign**
  - *Context:* Update the Dishes (Menu) list and management pages to match the new `PrototypeKp` aesthetics and design language.

### P5 (Maintenance)
- [ ] **Documentation cleanup and archive migration**
  - *Context:* Execution of the documentation restructuring plan, moving old `-plan.md` files into historical archive folders.

---

## Completed Milestones

The following major architectural and UX milestones have already been successfully delivered into the system:
- **PrototypeKp Migration:** Made `PrototypeKp.js` the primary document editor and redirected the `/new` route to it.
- **Legacy Fallback Preservation:** Moved `Form.js` to `/new-legacy` to safely preserve older manual workflows.
- **Toast-Based Validation:** Replaced fragmented, inline red-text validation with a robust, centralized `react-toastify` notification system for mandatory fields.
- **Contractor Auto-Creation:** Engineered silent auto-generation of CRM Contractors based on the KP document's `companyName` input.
- **Event Auto-Creation:** Engineered silent auto-generation of operational Events when a KP is saved without a pre-selected Event.
- **Single-Day Event Fix:** Corrected validation payload synchronization so single-day events no longer require missing second-day fields.
- **Sticky Footer & UX Layers:** Implemented `.proto-sticky-bar` and fixed z-index overlapping issues with dropdown autocomplete menus.
