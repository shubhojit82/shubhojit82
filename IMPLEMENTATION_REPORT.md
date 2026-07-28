# Implementation Report — Feature: evidence-first-profile

**Branch:** `feature/evidence-first-profile`  
**Date:** 2025-05-10  
**Status:** Ready for PR review

---

## Summary

This report documents all changes made on the `feature/evidence-first-profile` branch relative to `main`. The work transforms the portfolio site from a résumé-style page into an authoritative, evidence-led professional portfolio — correcting all factual issues, removing private member identifiers, hardening the booking backend, and adding structured metadata, accessibility, and supporting pages.

---

## Critical Factual Corrections (docs/index.html)

| Issue | Previous | Fixed |
|-------|----------|-------|
| **IEEE member # exposed** | `#102577671` appeared in awards card title, card body, card tags, and academic profile card | Replaced with "Active IEEE Member" in all 4 locations |
| **IBM tenure conflation** | "IBM Consulting · 19 yrs 8 mos" / "IBM Consulting · 19+ yrs" implied continuous IBM tenure | Changed to "19+ years of enterprise technology" / "19+ yrs industry experience" throughout |
| **Hero CTA** | Primary "Book a Session" button | Changed to "Explore Impact" (primary) + "View Recognition" (secondary) |
| **LinkedIn Followers counter** | `data-target="3524"` — maintenance burden, changes daily | Removed stat card entirely |
| **"50+ Enterprise Projects" counter** | Approximate/unverifiable `data-target="50"` | Removed stat card entirely |
| **"Verified Awards" label** | "Verified Awards" stat label | Changed to "Selected Awards & Recognition" |
| **Claro Awards status** | "Verified · Confirmed via LinkedIn post · 45 reactions" | Changed to "Invitation accepted · Evaluation in progress · LinkedIn post · 45 reactions" |
| **Footer IBM conflation** | "IBM Consulting · 19+ years" | Changed to "19+ years of enterprise technology experience" |
| **Meta keywords** | Contained "Shopify Plus Architect", "Shopify Integration Architect" | Removed Shopify-specific architect terms |
| **Hero lead text** | "Shopify and composable-commerce ecosystems" | Changed to "composable-commerce ecosystems" |
| **Hero chips** | "Shopify & Composable Commerce" | Changed to "Composable Commerce" |
| **Tech marquee** | "Shopify & Composable Commerce" | Changed to "Composable Commerce Architecture" (both instances) |
| **About intro** | "IBM Consulting · Hillsborough, NJ" implied primary identifier | Removed IBM Consulting from intro positioning |
| **Stats: initial "0" flash** | All stat counters showed "0" before JS ran | Hard-coded initial values matching targets |
| **Footer copyright** | "IBM Consulting" in copyright line | Removed |

---

## Security Fixes (docs/appsscript.gs)

| Issue | Fix |
|-------|-----|
| **Formula injection** | Added `sanitizeField()` function stripping `= + - @ \t \r` prefixes on all user inputs |
| **Input length limits** | name ≤120, email ≤200, topic ≤500, service ≤200, timezone ≤80, preferred_time ≤200 |
| **Error message leakage** | `err.toString()` no longer returned to public callers — replaced with generic message |
| **Email format validation** | Basic regex guard before writing to sheet |
| **Title fix** | "Forward-Deployed AI Architect" in email HTML → "Enterprise AI, Digital Experience & Commerce Architect" |

---

## New Features Added (docs/index.html)

| Feature | Details |
|---------|---------|
| **Canonical URL** | `<link rel="canonical" href="https://shubhojit82.github.io/shubhojit82/docs/">` |
| **Open Graph tags** | `og:type`, `og:url`, `og:title`, `og:description`, `og:image` |
| **Twitter Card tags** | `twitter:card`, `twitter:title`, `twitter:description` |
| **JSON-LD Person schema** | Schema.org `@type: Person` with `sameAs` array, `knowsAbout`, `address` |
| **Skip-to-content link** | `<a class="skip-link" href="#about">` for keyboard/screen-reader accessibility |
| **"Evidence" nav link** | Links to `evidence.html` in both main nav and footer nav |
| **"Executive Bio" footer link** | Links to `executive-bio.html` |

---

## New CSS Added (docs/styles.css)

| Addition | Purpose |
|----------|---------|
| `.skip-link` | Keyboard-accessible skip-to-content link (off-screen until focused) |
| `@media (prefers-reduced-motion: reduce)` | Disables all animations, transitions, marquee, orbs, reveal effects for users who prefer reduced motion |

---

## New Files Created

| File | Purpose |
|------|---------|
| `docs/robots.txt` | Allows all crawlers, points to sitemap |
| `docs/sitemap.xml` | XML sitemap with 3 URLs (index, bio, evidence) |
| `docs/executive-bio.html` | Executive biography page — short (~75 words) and long (~200 words) bio, expertise list, recognition, community |
| `docs/evidence.html` | Evidence Center — filterable grid of all claims with verification status, ribbon color-coding, and placeholder notes |
| `docs/data/profile.json` | Structured profile data |
| `docs/data/recognition.json` | Awards, judging, recognition with placeholder fields |
| `docs/data/community.json` | Nonprofit and judging data with placeholder fields |
| `docs/data/credentials.json` | Certifications, education, academic profiles |
| `docs/data/testimonials.json` | Testimonials with permission notes |
| `README.md` | Full rewrite — correct title, positioning, project table, profiles, recognition, community, booking setup |
| `.gitignore` | Excludes `private-evidence/`, OS artefacts, draft files |
| `AUDIT_REPORT.md` | Site audit with priority matrix (prior session) |
| `CONTENT_GAPS.md` | Structured content gaps tracker (prior session) |
| `EVIDENCE_MODEL.md` | Evidence classification schema (prior session) |

---

## Content Gaps Remaining (tracked in CONTENT_GAPS.md)

The following items have `[PLACEHOLDER]` markers in the JSON data files and/or HTML pages. Supply content to fill these in:

- **IBM award years** — confirm year from award certificates
- **Credly badge URLs** — add direct badge URLs for Adobe Certified Master and IEEE milestone
- **Testimonial quotes** — obtain explicit written permission from Rahul Nair and Greg Williams before publishing quotes publicly
- **Sreeshti org URL** — confirm public website URL
- **CAB description** — confirm board name, organization, and description
- **Anandamandir / Kallol** — confirm role description and public URL
- **Education** — degree, field, institution, year (if to be disclosed)
- **IBM award Credly/badge URLs** — if IBM badges were issued via Credly

---

## Validation Checklist

- [x] No `102577671` appears anywhere in `docs/index.html`
- [x] No "IBM Consulting · 19+ yrs" conflation anywhere in `docs/index.html`
- [x] No "IBM Consulting · 19 yrs 8 mos" conflation
- [x] No "Verified Awards" label
- [x] No LinkedIn Followers counter
- [x] No "50+ Enterprise Projects" counter
- [x] Claro Awards shows "Invitation accepted · Evaluation in progress"
- [x] Hero primary CTA is "Explore Impact"
- [x] Skip-to-content link present
- [x] `prefers-reduced-motion` CSS present
- [x] JSON-LD Person schema present in `<head>`
- [x] OG and Twitter Card tags present
- [x] Canonical URL tag present
- [x] `appsscript.gs` — `sanitizeField()` applied to all user inputs
- [x] `appsscript.gs` — `err.toString()` no longer exposed publicly
- [x] `appsscript.gs` — "Forward-Deployed AI Architect" replaced
- [x] `robots.txt` created
- [x] `sitemap.xml` created
- [x] `executive-bio.html` created
- [x] `evidence.html` created with filterable evidence cards
- [x] `README.md` fully rewritten
- [x] `.gitignore` created with `private-evidence/` excluded
