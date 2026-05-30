# Auth Redesign Plan

## Goal

Redesign authentication experience to match the new UI foundation
and operational SaaS direction of KP Creator.

The current auth experience feels visually outdated
and disconnected from the new application shell.

The goal is:
- cleaner onboarding experience
- modern operational SaaS feel
- better visual hierarchy
- improved desktop and mobile UX

---

# Problems

Current issues:
- outdated visual structure
- weak spacing hierarchy
- oversized elements
- inconsistent layout
- disconnected from new UI foundation

---

# Design Direction

Target feel:
- compact
- clean
- operational
- trustworthy
- lightweight

Avoid:
- flashy marketing UI
- excessive gradients
- animated auth screens
- startup-style hero sections

---

# Layout Strategy

## Desktop

Centered auth card:
- logo
- title/subtitle
- form
- submit action

Optional future:
- side branding panel
- background illustration

---

## Mobile

- single-column layout
- compact spacing
- full-width controls

---

# Auth Components

## Login Form

Fields:
- email/login
- password

Actions:
- login
- remember session (future)
- forgot password (future)

---

# UI Requirements

## Inputs

- consistent heights
- compact spacing
- proper focus states
- predictable validation feedback

---

## Buttons

- standardized sizing
- clear primary action hierarchy

---

## Validation UX

- inline validation
- error feedback
- loading states

Avoid:
- browser-native ugly alerts
- unclear failures

---

# Technical Constraints

Must preserve:
- existing auth API
- current auth logic
- Zustand auth flow
- existing routing

Avoid:
- auth rewrites
- backend auth changes
- permission system changes

---

# Future Compatibility

Auth layout should support future:
- registration
- forgot password
- invitation flow
- multi-user teams
- permissions
- SSO (future)

without redesigning the auth structure.