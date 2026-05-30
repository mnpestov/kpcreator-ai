# Mobile Navigation Fix

## Problem

Current sidebar behavior below 768px:
- moves to top horizontal strip
- creates horizontal overflow
- introduces horizontal scrolling
- scales poorly with future modules

This breaks mobile UX and navigation predictability.

---

# Goal

Introduce stable mobile navigation behavior
without redesigning the application shell.

---

# Target Mobile Behavior

## Mobile Topbar

Below 768px:
- compact topbar
- burger menu button
- logo/title
- optional profile shortcut

---

## Mobile Sidebar

Sidebar becomes:
- overlay drawer
- hidden by default
- opened via burger button
- closed on navigation selection

---

# UX Rules

Mobile navigation should:
- never create horizontal scrolling
- never overflow viewport width
- remain lightweight
- preserve fast navigation

Avoid:
- animated complex menus
- tab systems
- bottom navigation
- deep nested menus

---

# Technical Constraints

Must preserve:
- existing sidebar architecture
- existing routes
- current layout system

Avoid:
- routing rewrites
- navigation rewrites
- global state complexity

---

# Future Compatibility

Mobile navigation must support future modules:
- Contractors
- Employees
- Equipment
- Events
- Documents

without future redesign.