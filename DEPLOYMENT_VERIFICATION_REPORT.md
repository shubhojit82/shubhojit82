# Deployment Verification Report

**Date:** 2026-07-28  
**Verified by:** Automated inspection + live HTTP content check  
**Status:** ✅ All corrections confirmed live

---

## Git State

| Item | Value |
|------|-------|
| Active branch | `main` |
| Tracking | `origin/main` → `github.com/shubhojit82/shubhojit82` |
| Latest commit | `70fe449` Fix IBM USA timeline period to 2016 – Current |
| Uncommitted changes before this pass | None |
| Obsolete remote branches | None (`feature/evidence-first-profile` deleted) |

---

## Files Changed in This Pass

| File | Change |
|------|--------|
| `docs/index.html` | Remove "verified" from testimonials subtitle; fix CTA card text; add LinkedIn source link |
| `CORRECTION_REPORT.md` | Update date from 2025-05-10 → 2026-07-28 |
| `IMPLEMENTATION_REPORT.md` | Update date from 2025-05-10 → 2026-07-28 |

---

## Forbidden Phrase Audit

Searched entire repository (`README.md`, `docs/`, `.github/`) for all forbidden phrases.

| Phrase | Result |
|--------|--------|
| `verified enterprise commerce` | ✅ Not found |
| `prestigious Mindtree` | ✅ Not found |
| `Verified awards from` | ✅ Not found |
| `Research Identity & Scholarly Presence` | ✅ Not found |
| `19+ years of IBM delivery` | ✅ Not found |
| `19+ years of IBM enterprise delivery` | ✅ Not found |
| `Shopify Platform Architecture` | ✅ Not found |
| `MoMA / IBM Consulting` | ✅ Not found |
| `MoMA Digital Transformation — Project Architect` | ✅ Not found |
| `Forward-Deployed AI Architect` | ✅ Not found |
| `102577671` (IEEE member number) | ✅ Not found |
| `Content in progress` | ✅ Not found |
| `year to be confirmed` | ✅ Not found |
| `Public URL to be confirmed` | ✅ Not found |

---

## Required Phrase Confirmation (local `main`)

| Required phrase | Present |
|----------------|---------|
| `Shopify Reference Architecture` | ✅ 1 match |
| `Selected awards and professional recognition` | ✅ 1 match |
| `Research identifiers have been established` | ✅ 1 match |
| `MoMA E-Commerce Search Transformation` | ✅ 1 match |
| `2016 – Current` (IBM USA timeline) | ✅ 1 match |
| `19+ years of enterprise technology experience` | ✅ present |
| `Enterprise AI, Digital Experience & Commerce Architect` | ✅ present |

---

## Shopify Disclaimer Confirmed

- Section card title: **"Shopify Reference Architecture"** ✅
- Card description opens with: *"Designing reference architectures and integration blueprints for enterprise Shopify and Shopify Plus ecosystems"* ✅
- Enterprise Integration card: *"Integration blueprints for connecting Shopify…"* ✅
- Mobile Commerce card: *"Composable-commerce architecture pattern…"* ✅
- README: explicit note — *"Shopify content is presented as reference architecture and integration blueprints, not as a claimed production client deployment."* ✅

---

## MoMA / Mindtree Correction Confirmed

- Award card title: **"Mindtree Hats Off Award — MoMA E-Commerce Search"** ✅
- Case study challenge: **"MoMA E-Commerce Search Transformation — Mindtree US"** ✅
- `"extraordinary results"` appears only as attributed quotation from award citation ✅
- No instance of `"MoMA / IBM Consulting"` anywhere ✅
- `docs/data/recognition.json` org field: `"Mindtree US Practice"` ✅
- `docs/executive-bio.html`: `"Mindtree Hats Off Award — MoMA E-Commerce Search Transformation (May 2016)"` ✅
- `docs/evidence.html`: `"MoMA E-Commerce Search Transformation — Mindtree US · May 2016"` ✅

---

## Award Terminology Confirmed

- Section subtitle: *"Selected awards and professional recognition from clients, employers, and industry organizations"* ✅
- All status labels use approved vocabulary: Certificate available / Official letter available / Publicly verifiable / Evaluation in progress ✅
- No "Verified ·" universal prefix on any award card ✅
- "Prestigious" absent ✅

---

## Research Section Confirmed

- Heading: **"Research Profiles"** ✅
- Intro: *"Research identifiers have been established in preparation for upcoming technical publications. Published work and citation information will be added after release and indexing."* ✅
- No implication of authorship, citations, or scholarly impact ✅

---

## Privacy Review

| Identifier | Status |
|-----------|--------|
| IEEE member number | ✅ Not present in any public file |
| Employee / certificate serial numbers | ✅ None found |
| Immigration / compensation / client-confidential content | ✅ None found |
| `private-evidence/` directory | ✅ In `.gitignore`, not committed |

---

## Counters and Static Content

| Stat | HTML initial value | JS target |
|------|--------------------|-----------|
| Years of Experience | `19+` | 19 |
| Credly Badges & Certs | `25+` | 25 |
| Selected Awards & Recognition | `6` | 6 |
| Nonprofit Engagements | `4` | 4 |

All core facts present in HTML before JavaScript executes. No "0" initial values. ✅

---

## README Review

| Item | Status |
|------|--------|
| Primary identity | `Enterprise AI, Digital Experience & Commerce Architect` ✅ |
| IBM/Mindtree named separately | ✅ |
| Shopify reference-architecture disclaimer | ✅ |
| Award table with confirmed years | ✅ |
| Repo type labels (Reference architecture / Prototype / Training material / Operational platform) | ✅ |
| Research profiles caveat | ✅ |
| "Forward-Deployed AI Architect" removed | ✅ |
| Draft/conversational instructions removed | ✅ |

---

## Testimonial Publishing Status

Two quotes from LinkedIn recommendations are displayed:

- **Rahul Nair** — IBM colleague recommendation
- **Greg Williams, MBA** — Hertz client recommendation

Both are LinkedIn public recommendations. No private direct-source links are available in the repository. Actions taken in this pass:

- Removed "verified" label from testimonial section subtitle → now reads *"2 recommendations shown"*
- Removed "9 verified recommendations" from CTA card → now reads *"9 recommendations on LinkedIn"*
- Added direct LinkedIn profile link in section subtitle
- CTA button links to `https://www.linkedin.com/in/shubhojitchowdhury`

**Manual action required** from Shubhojit: If direct permanent URLs to the individual LinkedIn recommendations exist, add them as `<a>` source links beneath each testimonial card. See CONTENT_GAPS.md.

---

## GitHub Pages Configuration

| Item | Value |
|------|-------|
| Source | Branch `main`, folder `/docs` (configured via GitHub UI) |
| Workflow file | None required — Pages deploys automatically on push to `main` |
| `_config.yml` | Not present (static HTML site, not Jekyll) |
| `.github/workflows/` | Not present |

---

## Live Site Verification

**URL checked:** `https://shubhojit82.github.io/shubhojit82/docs/index.html`  
**Timestamp:** 2026-07-28  
**HTTP status:** `200 OK`

### Required phrases confirmed present in live HTML

| Phrase | Live count |
|--------|-----------|
| `Shopify Reference Architecture` | 1 ✅ |
| `Selected awards and professional recognition` | 1 ✅ |
| `Research identifiers have been established` | 1 ✅ |
| `MoMA E-Commerce Search Transformation` | 1 ✅ |

### Forbidden phrases confirmed absent from live HTML

| Phrase | Live count |
|--------|-----------|
| `verified enterprise commerce` | 0 ✅ |
| `prestigious Mindtree` | 0 ✅ |
| `Verified awards from` | 0 ✅ |
| `Research Identity` | 0 ✅ |
| `IBM delivery experience` | 0 ✅ |
| `MoMA / IBM Consulting` | 0 ✅ |
| `Forward-Deployed` | 0 ✅ |
| `102577671` | 0 ✅ |

---

## Remote Branches Remaining

| Branch | Status |
|--------|--------|
| `origin/main` | Active, up to date |
| `feature/evidence-first-profile` | Deleted |

---

## Remaining Manual Actions Required from Shubhojit

| # | Action | File |
|---|--------|------|
| 1 | Add direct Credly badge URLs for Adobe Certified Master and IEEE 1-Year Milestone | `docs/data/credentials.json` + portfolio |
| 2 | Add permanent LinkedIn recommendation URLs for Rahul Nair and Greg Williams, or confirm quotes are approved for public use | `docs/index.html` testimonial cards |
| 3 | Confirm Sreeshti public website URL and add it | `docs/data/community.json` + evidence.html |
| 4 | Add direct LinkedIn post URL for Claro Awards judging acknowledgement | `docs/data/recognition.json` + award card |
| 5 | Verify Credly profile link still resolves: `https://www.credly.com/users/a0941b65-1476-47a5-b114-6f67f0c6cd32/badges/credly` | `docs/index.html` credentials section |
| 6 | Add Albertsons client award card to `docs/evidence.html` if public display is approved | `docs/evidence.html` |

---

## Summary

The deployed portfolio at `https://shubhojit82.github.io/shubhojit82/docs/index.html` has been confirmed live with all corrections in place. All forbidden phrases are absent from both the local repository and the served public page. The deployment is complete.
