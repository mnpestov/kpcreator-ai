# AGENTS.md — AI-Agent Development Rules for kpcreatorai

> This document governs all AI-agent assisted development in this monorepo.
> Every agent MUST read and follow these rules before making any change.
> Violations can cause data loss, broken deployments, security incidents, or production regressions.

---

# 1. Project Identity

| Property | Value |
|---|---|
| Product | kpcreator.ru — Commercial Offer (КП) generator for catering |
| Architecture | Fullstack monorepo |
| Frontend | React 18 + CRA |
| Backend | Express 4 + Sequelize 6 |
| Database | PostgreSQL |
| State Management | Zustand 5 |
| Auth | JWT + bcrypt |
| UI Library | @skbkontur/react-ui |
| PDF Pipeline | html2canvas → jsPDF |
| Process Manager | PM2 |
| Reverse Proxy | Nginx |
| File Uploads | Multer |
| Migration System | Sequelize CLI |

---

# 2. Repository Structure

```text
kpcreatorai/
├── AGENTS.md
├── admin.html
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── migrations/
│   ├── models/
│   ├── routes/
│   ├── static/
│   ├── config/
│   ├── errors/
│   ├── db.js
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── validation/
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── data/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── package.json
│   └── build/
```

---

# 3. Architecture Rules

## 3.1 System Boundaries

* Frontend and backend are separate applications.
* Communication happens ONLY through REST API.
* Backend owns database access.
* Frontend must never directly access Sequelize or PostgreSQL.
* Backend must never import frontend code.

---

## 3.2 Data Flow

```text
React Component
→ Zustand Store
→ MainApi.js
→ Express Route
→ Controller
→ Sequelize Model
→ PostgreSQL
```

---

## 3.3 Existing Patterns — Follow, Don't Reinvent

Before creating new:

* hooks
* stores
* abstractions
* helpers
* wrappers
* utilities
* reusable components
* API clients
* service layers

agents MUST inspect the existing codebase and extend existing patterns instead of creating parallel implementations.

Prefer extension over reinvention.

---

## 3.4 Transitional Architecture Rule

The current architecture is transitional and partially legacy.

Agents must prioritize:

* stability
* backward compatibility
* minimal diffs

over architectural purity.

Do NOT attempt:

* large Zustand migrations
* state consolidation rewrites
* App.js decomposition
* architecture cleanup campaigns

unless explicitly requested.

---

## 3.5 Monorepo Coordination Rule

The monorepo is treated as one coordinated system.

Frontend, backend, PDF rendering, and persistence logic are tightly coupled.

Any change may affect:

* rendering
* generated PDFs
* API compatibility
* persistence
* print layouts
* synchronization logic

Cross-layer changes require extra caution and validation.

---

# 4. Frontend Rules

## 4.1 React

* React version is locked to React 18.
* Do NOT migrate to Next.js, Vite, Remix, or other frameworks.
* Do NOT eject CRA.
* Do NOT introduce SSR.

---

## 4.2 UI

* Use `@skbkontur/react-ui`.
* Do NOT introduce:

  * MUI
  * Ant Design
  * Chakra
  * Mantine
  * Tailwind rewrites

unless explicitly requested.

---

## 4.3 State Management

* Zustand is the primary state system.
* Existing local state is allowed.
* Existing App.js orchestration is allowed.
* Do NOT rewrite state architecture proactively.

---

## 4.4 API Access

* All API calls MUST go through:
  `frontend/src/utils/MainApi.js`
* Do NOT introduce inline fetch logic across components.

---

## 4.5 PDF Rules

Generated PDFs are production business artifacts.

Visual regressions in PDFs are treated as critical bugs even if the React UI appears correct.

Do NOT:

* rewrite PDF flow
* replace html2canvas
* replace jsPDF
* alter print structure
* modify pagination logic

without explicit approval.

---

# 5. Backend Rules

## 5.1 Runtime

* Backend uses CommonJS.
* Do NOT migrate to ESM.
* Express 4 is locked.
* Sequelize 6 is locked.

---

## 5.2 Authentication

* JWT + bcrypt only.
* Do NOT replace auth architecture.
* Do NOT alter JWT payload structure without approval.

---

## 5.3 Database

* PostgreSQL only.
* All schema changes require migrations.
* Never rely solely on Sequelize model updates.

---

## 5.4 Uploads

* Multer disk storage remains active.
* Do NOT migrate uploads to cloud providers unless requested.

---

# 6. Protected Files

Changes to these files require mandatory human review BEFORE execution:

```text
backend/index.js
backend/models/models.js
backend/models/User.js
backend/controllers/authController.js
backend/middleware/authMiddleware.js

frontend/src/App.js
frontend/src/utils/MainApi.js
frontend/src/hooks/useKpStore.js
frontend/src/hooks/useAuthStore.js
```

---

# 7. Safe Refactoring Policy

## 7.1 Core Principles

* Backward compatibility first.
* Minimal diffs only.
* Incremental changes only.
* Stability over purity.
* Never refactor unrelated code.

---

## 7.2 UI Stability Rules

* Never rewrite working React components completely.
* Prefer surgical JSX edits.
* Preserve DOM structure whenever possible.
* Preserve CSS class names whenever possible.
* Avoid component tree restructuring.
* Avoid layout changes while fixing logic bugs.
* Preserve print compatibility.

`frontend/src/App.js` is considered a high-risk orchestration file.

Avoid:

* large refactors
* routing rewrites
* PDF flow rewrites
* component tree restructuring
* business logic extraction campaigns

unless explicitly instructed.

---

## 7.3 Business Logic Safety

The following logic is business-critical:

* КП totals
* pricing
* quantity calculations
* manager selection
* PDF rendering
* pagination
* printed layout
* date normalization
* list aggregation

Agents must NEVER silently change:

* formulas
* totals
* ordering
* pricing behavior
* pagination
* calculations
* document structure

without explicit approval.

---

## 7.4 Anti-Overengineering Rule

Avoid introducing abstraction layers unless there is clear repeated usage.

Do NOT introduce:

* repository patterns
* service locators
* plugin systems
* event buses
* dependency injection containers
* enterprise architecture layers
* generic factories

unless explicitly requested.

---

## 7.5 Known Technical Debt (Do Not Fix Unless Asked)

Known issues exist intentionally or require coordinated migration:

* `sequelize.sync({ alter: true })`
* duplicated API base URLs
* mixed Zustand + legacy state
* unfinished manager/product systems
* oversized App.js orchestration

Do NOT proactively fix these as side effects.

---

# 8. Git Workflow Rules

## 8.1 Commit Strategy

* Use small atomic commits.
* Create frequent checkpoints.
* Avoid large uncommitted change sets.

---

## 8.2 Commit Prefixes

Use:

* feat:
* fix:
* refactor:
* docs:
* chore:
* style:
* migration:

---

## 8.3 Diff Discipline

* Minimal diffs only.
* No mass rewrites.
* No formatting-only rewrites.
* Preserve existing style.
* Preserve whitespace style.
* Preserve file structure.

---

## 8.4 Never Commit

```text
node_modules/
.env
.env.local
.env.production
frontend/build/
backend/static/
.DS_Store
```

---

# 9. Migration Safety Rules

## 9.1 Absolute Rules

NEVER:

* run `sequelize.sync({ force: true })`
* run destructive migrations
* modify applied migrations
* drop tables
* truncate tables

---

## 9.2 Migration Workflow

Every migration must:

* have up/down
* be reversible
* be tested locally
* be human-reviewed

---

## 9.3 Schema Safety

Model changes REQUIRE:

* Sequelize migration
* compatibility validation
* human review

---

# 10. Forbidden Actions

## 10.1 Destructive Operations

Forbidden:

* rm -rf
* force push
* hard reset
* destructive migrations
* deleting uploads
* deleting env files

---

## 10.2 Architecture Violations

Forbidden:

* TypeScript migration
* Prisma migration
* Next.js migration
* Vite migration
* Redux migration
* GraphQL introduction
* WebSocket architecture
* SSR introduction

unless explicitly requested.

---

## 10.3 Security Violations

Forbidden:

* disabling auth
* weakening bcrypt
* exposing secrets
* adding eval
* dangerouslySetInnerHTML
* unsafe JWT changes

---

## 10.4 Deployment Actions

Forbidden:

* production deployment
* PM2 restart
* Nginx modification
* remote server execution
* certbot execution

without explicit approval.

---

# 11. Review Workflow

## 11.1 Before Every Change

Agents MUST:

1. Read relevant files fully.
2. Inspect usages and side effects.
3. Explain the plan.
4. Explain risks.
5. Explain validation strategy.

---

## 11.2 Mandatory Human Review Required

STOP and request review before:

* schema changes
* auth changes
* App.js rewrites
* PDF changes
* dependency installation/removal
* route structure changes
* API response changes
* Zustand structure changes

---

## 11.3 After Every Change

Verify:

* backend startup
* frontend build
* minimal diff size
* no accidental rewrites

---

# 12. Environment Rules

## Backend Variables

```text
PORT
DB_NAME
DB_USER
DB_PASSWORD
DB_HOST
DB_PORT
JWT_SECRET
```

---

## Frontend Variables

```text
REACT_APP_API_URL
```

---

# 13. Testing Rules

Current automated testing coverage is minimal.

Preferred stack:

* Jest
* React Testing Library

Do NOT introduce:

* Vitest
* Cypress rewrites
* Playwright migration campaigns

unless explicitly requested.

---

# 14. Decision Matrix

| Situation           | Action            |
| ------------------- | ----------------- |
| Small isolated fix  | Proceed carefully |
| Multi-file refactor | Request review    |
| Schema change       | STOP              |
| Auth change         | STOP              |
| Dependency change   | STOP              |
| PDF change          | STOP              |
| Unsafe uncertainty  | STOP and ask      |

---

# 15. AI Execution Constraints

* Never perform large multi-file rewrites in one step.
* Prefer incremental validated changes.
* Never modify multiple architectural layers simultaneously unless instructed.
* Never silently add dependencies.
* Never silently remove legacy logic.
* Always preserve backward compatibility.
* Prefer extension over replacement.
* If uncertain, STOP and ask.

---

# 16. Primary AI Development Philosophy

The goal of AI-assisted development in this repository is:

* controlled evolution
* safe incremental progress
* stability-first engineering
* minimal regression risk
* human-reviewed autonomy

NOT:

* architecture perfection
* enterprise abstraction
* framework migration
* aggressive modernization
* speculative rewrites

AI agents are collaborators, not autonomous owners of the system.

---

## Development Philosophy

- incremental evolution over rewrites
- minimal diffs
- reusable foundations
- build after changes
- avoid unrelated refactors
- stabilize before expanding
- update docs as architecture evolves

---

*Last updated: May 2026*