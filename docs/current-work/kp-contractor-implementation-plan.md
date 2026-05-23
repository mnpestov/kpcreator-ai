# KP ↔ Contractor Integration — Implementation Plan

## Goal

Implement the relationship between:
- commercial proposals (KP)
- contractors

while preserving backward compatibility
with existing KP records.

---

# Scope

## Backend

### Database
Add:
- contractorId to KP table

Requirements:
- nullable
- foreign key to Contractors.id
- reversible migration

---

## Sequelize Relationships

Add:
- KP belongsTo Contractor
- Contractor hasMany KP

Use existing backend conventions.

---

## API

KP endpoints should:
- accept contractorId
- return contractor relation when loading KP

No advanced filtering yet.

---

# Frontend

## KP Form

Add contractor selection:
- searchable select/dropdown
- optional field
- compact operational layout

Field location:
- near customer/event information

---

## KP Preview

Display:
- contractor company name

Optional:
- contact person later

---

## KP History

Display contractor column in:
- recent KP list
- history table

Keep compact density.

---

# Excluded

Do NOT implement:
- contractor autofill
- реквизиты sync
- advanced contractor search
- contractor analytics
- relationship automation

These belong to future phases.

---

# Technical Constraints

Avoid:
- breaking existing KP records
- mandatory contractor validation
- generic relationship systems

Prefer:
- explicit implementation
- backward compatibility
- lightweight integration

---

# Verification

After implementation:
1. Run migrations
2. Verify old KP records still open correctly
3. Verify new KP can save with contractor
4. Verify KP can save without contractor
5. Verify contractor renders in preview/history
6. Run frontend/backend verification

---

# Future Compatibility

This integration should later support:
- Event ↔ KP linking
- contractor history
- operational analytics
- workflow statuses
- procurement planning