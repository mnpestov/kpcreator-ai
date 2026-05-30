# System Architecture

## Document Driven Philosophy
KP Creator operates on the principle that the **Commercial Proposal (KP)** is the primary vessel for capturing business intent. Instead of forcing managers to pre-register Clients, Venues, and Events in separate CRM interfaces before quoting a price, the system allows the user to draft the document naturally. The backend architecture is responsible for silently extracting, normalizing, and synthesizing these operational entities (Events, Contractors) from the KP payload. The document drives the data model, reducing friction in the sales pipeline.

## Legacy vs Modern Architecture
The project is in an active transitional phase. 
- **Legacy Architecture (`Form.js`)**: Characterized by oversized form controls, modal-heavy entity creation (e.g., clicking '+' to create a contractor in a blocking popup), fragmented validation states, and reliance on `@skbkontur/react-ui` for layout structure.
- **Modern Architecture (`PrototypeKp.js`)**: Characterized by a mobile-first, single-page operational view. It utilizes CSS-isolated `.proto-` components, robust toast-based validation, intelligent auto-creation flows that avoid blocking the user, and a highly dense, readable data-entry grid for menus and items.

## Domain Model
The architecture centers around three primary entities:

1. **Commercial Proposal (KP)**: The core business entry point. It orchestrates the creation of underlying operational entities and acts as the document record for what is being sold and at what price.
2. **Event**: The operational execution entity. It represents the physical gathering, bound to specific dates, times, and a location.
3. **Contractor**: The client, company, or agency ordering the event.

## KP / Event / Contractor Relationships
- `Contractor.hasMany(Event)`
- `Contractor.hasMany(Kp)`
- `Event.hasMany(Kp)`

**Note:** The `Kp` preserves explicit foreign keys to both `Event` and `Contractor` (`eventId` and `contractorId`). This guarantees historical immutability; even if the Event changes ownership in the future, the original KP remains tied to the Contractor who requested it at the time.

## Save Orchestration (`addToDb`)
`addToDb` inside `App.js` serves as a centralized "Entity Synthesis" layer. It isolates the complexities of entity creation from the UI components.
Execution Order:
1. **Contractor Creation**: Analyzes `formData`, creates Contractor if missing.
2. **Event Update**: Syncs `contractorId` and full date payload to an existing Event if authorized by the user.
3. **Event Creation**: Analyzes `formData`, creates Event if missing.
4. **KP Generation**: Creates the KP document header via `MainApi.addKp()`.
5. **Row Generation**: Iterates through sheets and generates line items via `MainApi.addList()`.

## Frontend Architecture
- **Framework**: React 18 initialized with Create React App (CRA).
- **State Management**: Zustand handles global stores (`useKpStore`, `useAuthStore`). Complex operational components like `PrototypeKp` utilize localized React state to avoid sync conflicts with legacy stores.
- **API Layer**: Centralized API calls are strictly routed through `MainApi.js`.
- **Styling**: Vanilla CSS utilizing BEM-like `.proto-` prefixes for new components, ensuring isolation from legacy `@skbkontur/react-ui` overrides.

## Backend Architecture
- **Runtime**: Node.js using CommonJS modules.
- **Framework**: Express 4.
- **Database**: PostgreSQL orchestrated via Sequelize 6.
- **Controllers**: Thin controllers that handle REST mapping and lightweight validation (e.g., `eventController.update()` strictly requiring `title`).
- **File Uploads**: Managed locally via Multer disk storage.

## Current Design Principles
1. **Extend, don't reinvent**: Prefer minimal diffs and surgical refactoring over large-scale rewrites.
2. **Stability over Purity**: Backward compatibility takes precedence over architectural purity.
3. **No Speculative Abstractions**: Avoid generic form builders, universal CRUD frameworks, or complex workflow engines unless specifically required.
