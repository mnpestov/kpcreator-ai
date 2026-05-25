# Current State

## Architecture
- React 18 Frontend
- Express + Sequelize Backend
- `MainApi.js` for centralized API access
- Zustand stores for state management

## KP-First Operational Workflow
The primary operational entity in the system is the **Commercial Offer (КП)**.
Events and Contractors act as derived operational context.

### Inline Contractor Creation
Managers can create contractors dynamically directly from the KP creation form without leaving the flow:
- Clicking the `+` button near the Contractor select opens a compact popup.
- The new contractor is immediately persisted via `MainApi.createContractor`.
- The dropdown automatically selects the newly created contractor.

### Auto Event Creation
Events are generated automatically based on KP details during the **explicit save flow**:
- An Event is created only if `eventId` is missing in the payload AND the required operational fields (`listTitle`, `startEvent`, `eventPlace`) are present.
- The system extracts and maps these fields intelligently (e.g. mapping `countOfPerson` to Event `notes`).
- The newly created `eventId` is automatically linked to the KP payload before persisting the KP document.
- This prevents the creation of empty, partial, or draft events, ensuring they are operationally meaningful.

## Testing Strategy
Smoke tests are written in Playwright. All tests generating sample data use the `[SMOKE]` prefix.
A dedicated `cleanupSmokeData.js` utility cleans up smoke data in a reliable, dependency-ordered manner.
