# Event ↔ KP Link Implementation Plan

## Goal

Introduce the first lightweight operational relationship
between:
- KP
- Event

without introducing synchronization
or workflow automation.

---

# Scope

## Backend

### KP Model

Add:
- eventId (nullable)

Relationship:
- KP belongsTo Event
- Event hasMany KP

Use explicit Sequelize relationships.

---

## Migration

Add nullable foreign key:
```txt
eventId → Events.id
```

Requirements:
- reversible migration
- SET NULL on delete
- backward compatibility

---

## API

KP endpoints should:
- accept eventId
- return linked Event relation

No synchronization logic.

---

# Frontend

## KP Form

Add section:
```txt
Связь с событием
```

Support:
- optional Event selection
- upcoming Event dropdown

No auto-create yet.

---

## KP Preview

Display:
- linked Event title (optional)

---

## Event Details

Display:
- linked KP list (optional lightweight block)

---

# UX Constraints

Avoid:
- duplicate operational forms
- complex workflows
- event orchestration
- automatic synchronization

Prefer:
- lightweight linking
- explicit relationships
- operational clarity

---

# Technical Constraints

Avoid:
- global architecture rewrites
- workflow engines
- state management rewrites

Prefer:
- minimal diffs
- explicit relations
- incremental integration

---

# Verification

After implementation:
1. Link KP to Event
2. Save and reload KP
3. Verify Event relation persists
4. Verify old KP still work
5. Verify Event details render linked KP
6. Run frontend/backend verification

---

# Future Compatibility

This foundation should later support:
- auto Event creation from KP
- multi-KP events
- operational workflows
- procurement planning
- calendar coordination