# Stabilization Bugfix Pass

## Goal

Fix critical operational consistency and state synchronization issues
discovered during manual QA after the foundation and CRUD implementation phases.

---

# Critical Bugs

## 1. Logout Does Not Redirect Properly

Current behavior:
- auth state clears
- header/sidebar disappears
- stale protected page remains visible

Expected:
- immediate redirect to login page
- full protected layout unmount

Priority:
Critical

---

## 2. Header Missing After Login

Current behavior:
- successful login
- protected page opens
- header/sidebar missing until refresh

Expected:
- full authenticated layout renders immediately after login

Priority:
Critical

---

## 3. Profile Save Depends On Password Field

Current behavior:
- personal info changes are ignored unless new password is entered

Expected:
- profile fields save independently
- password change remains optional

Priority:
High

---

## 4. New KP Form Reuses Previous KP State

Current behavior:
- opening "New KP" after viewing/editing an existing KP
  reuses previous form state

Expected:
- new form starts clean
- form state resets properly

Priority:
Critical

---

## 5. Home Page KP Sorting Incorrect

Current behavior:
- oldest proposals remain fixed in list
- only newest 1-2 entries change

Expected:
- latest proposals sorted correctly
- newest items displayed first

Priority:
Medium

---

# Technical Constraints

Avoid:
- architecture rewrites
- global state redesign
- routing rewrites

Prefer:
- targeted fixes
- minimal diffs
- explicit state resets
- predictable auth synchronization

---

# Goal

Stabilize operational consistency
before continuing feature expansion.