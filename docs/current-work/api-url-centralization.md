# API URL Centralization

## Goal

Centralize frontend backend URL usage via API_BASE_URL.

## Completed

- const.js
- MainApi.js
- AuthContext.js
- useAuthStore.js
- LoginPage.js

## Remaining

- FirstList.js
- HiddenPrint.js
- Preview.js
- Profile.jsx

## Constraints

- follow AGENTS.md
- minimal diffs only
- no unrelated cleanup
- preserve backward compatibility
- run frontend build after changes
- stop before commit

## Decisions

- canonical env var: REACT_APP_API_URL
- Profile.js is legacy and must not be modified

## Workflow

1. analyze
2. execute small scoped changes
3. run frontend build
4. review diffs
5. commit checkpoint
6. push