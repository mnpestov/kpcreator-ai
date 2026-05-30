# Current State of KP Creator

## Operational Workflow
KP Creator uses a **Document-Driven Workflow** to populate an **Operational Event Management Platform**. 
The primary entry point for users is the Commercial Proposal (KP), which automatically synthesizes backend Event and Contractor entities. This ensures that users do not need to manually create underlying CRM entities before issuing a commercial offer.

## Routing Architecture
- `/new`: Uses `PrototypeKp.js` (Primary flow, mobile-first, robust validation).
- `/new-legacy`: Uses `Form.js` (Fallback route, legacy UI, manual creation popups).
- `/kp/:kpNumber`: `KpLoader` fetches the document data and automatically redirects to the `/preview` route to render the printable layout.

## Save Flow & Auto-Creation (`addToDb`)
When a KP is saved via `PrototypeKp`, a strict sequence guarantees data consistency without interrupting the user:

1. **Validation**: Toast-based validation checks `isMultiDay` consistency, mandatory dates, and financial fields.
2. **Contractor Auto-Creation**: If a new company name is typed without selecting from the directory, it is auto-generated via `MainApi.createContractor()`.
3. **Event Auto-Creation**: If no Event is selected, one is auto-generated via `MainApi.createEvent()` using `startEvent`, `eventPlace`, and `listTitle`.
4. **KP Persistence**: Finally, the KP header and its item rows are saved to PostgreSQL via `MainApi.addKp()` and `MainApi.addList()`.

## Validation & UX
- Inline red-text validation has been entirely superseded by `react-toastify`.
- Z-index layering and `.proto-sticky-bar` are standard for mobile-first operational views, ensuring that long lists (like dishes catalogs) don't get obscured.
- Quick-add inputs enable rapid, keyboard-friendly data entry.

## Known Limitations
- The KP document header represents an immutable snapshot of the negotiation at the time of saving. While line items inside the document can be modified, the core event dates and contractor links of the saved KP are not reopened into the `PrototypeKp` flow for live two-way syncing.
- Unlinking an Event from a KP after save is restricted.
- Simultaneous editing of legacy state and Zustand stores requires careful synchronization.
