# KP ↔ Contractor Integration

## Goal

Connect commercial proposals (KP)
with the Contractors directory.

This establishes the first core business relationship
between operational entities.

---

# Scope

## Backend

### KP Model
Add:
- contractorId

Relationship:
- KP belongsTo Contractor
- Contractor hasMany KP

Field should remain optional for backward compatibility.

---

## Frontend

### KP Form
Add contractor selection field:
- searchable select/dropdown
- optional field
- compact layout

---

## KP History / Preview

Display contractor:
- company name
- optional contact person later

---

# Excluded

Do NOT implement:
- automatic реквизиты autofill
- contractor synchronization
- document generation logic
- contractor analytics
- advanced filtering

These belong to future phases.

---

# Technical Constraints

Avoid:
- schema rewrites
- mandatory contractor enforcement
- generic relationship abstractions

Prefer:
- explicit implementation
- backward compatibility
- lightweight integration

---

# Future Compatibility

This relationship will later support:
- Event ↔ KP linking
- contractor analytics
- document templates
- workflow automation
- procurement planning