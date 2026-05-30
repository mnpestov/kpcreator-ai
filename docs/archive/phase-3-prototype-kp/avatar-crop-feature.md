# Avatar Crop Feature

## Goal

Add avatar cropping before upload to:
- normalize avatar proportions
- improve PDF rendering stability
- improve avatar consistency across the app

## Current State

Current upload flow:
Profile.jsx
→ input[type=file]
→ handleAvatarUpload(file)
→ POST /profile/upload-avatar
→ setUser({ photo })

Current issue:
- browser preview works correctly
- generated PDF stretches non-square avatars
- root cause: html2canvas object-fit limitation

## Constraints

- follow AGENTS.md
- minimal diffs only
- preserve backward compatibility
- no backend rewrite
- no PDF pipeline rewrite
- no auth rewrite

## Planned Flow

upload image
→ open crop modal
→ user crops avatar
→ export square image from canvas
→ upload processed image
→ save filename in user.photo

## Decisions

- solve issue at upload stage instead of PDF stage
- keep existing backend upload endpoint
- keep existing avatar rendering flow
- use square cropped avatars

## Status

Planning