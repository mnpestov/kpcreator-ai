# Event Frontend Foundation — Implementation Plan

## Goal

Implement frontend CRUD pages
for operational event management.

This implementation should:
- integrate with the existing backend Event API
- preserve current UI architecture
- follow compact operational UI principles
- remain lightweight and incremental

---

# Scope

## Event List Page

Route:
```txt id="4r7kh9"
/events
```

Implementation:
- compact table layout
- columns:
  - date
  - title
  - contractor
  - status
  - location
  - actions

Actions:
- open
- edit

Features:
- loading state
- empty state
- mobile overflow handling

---

## Event Create/Edit Form

Routes:
```txt id="xktc0u"
/events/new
/events/:id/edit
```

Fields:
- title
- contractor
- eventDate
- startTime
- endTime
- location
- status
- notes

Requirements:
- responsive form layout
- compact operational spacing
- contractor dropdown
- textarea for notes

Validation:
- title required
- eventDate required

---

## Event Details Page

Route:
```txt id="sr5g84"
/events/:id
```

Display:
- title
- contractor
- date/time
- location
- status
- notes

Actions:
- edit
- back to list

---

# API Integration

Use existing backend routes:
```txt id="b1d0ow"
/events
/events/:id
```

Operations:
- GET all
- GET one
- POST
- PUT
- DELETE

No advanced filtering yet.

---

# Frontend Architecture

## MainApi.js

Add:
- getEvents()
- getOneEvent()
- createEvent()
- updateEvent()
- deleteEvent()

Follow existing API conventions.

---

## Pages

Create:
```txt id="mjlwmf"
pages/Events/
```

Suggested structure:
```txt id="4n1sbt"
EventsList.jsx
EventForm.jsx
EventDetails.jsx
Events.css
```

---

# Navigation

Add:
```txt id="jlwm2y"
События
```

to Sidebar navigation.

---

# UI Constraints

Prefer:
- operational density
- simple layouts
- compact forms
- restrained borders/shadows

Avoid:
- dashboards
- calendar widgets
- kanban boards
- heavy abstractions

---

# Technical Constraints

Avoid:
- React Query migration
- Zustand rewrites
- generic CRUD systems
- global architecture changes

Prefer:
- explicit components
- localized state
- lightweight implementation

---

# Verification

After implementation:
1. Create event
2. Edit event
3. Delete event
4. Verify contractor selection
5. Verify mobile layout
6. Verify sidebar navigation
7. Run frontend build

---

# Future Compatibility

This implementation should later support:
- calendar integration
- KP linking
- operational statuses
- employee assignments
- logistics planning