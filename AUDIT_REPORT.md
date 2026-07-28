# Audit Report — shubhojit82 Portfolio
**Date:** 2025-07  
**Branch:** feature/evidence-first-profile  
**Auditor:** Evidence-first review

---

## 1. Repository Structure

```
/
├── index.html          — Root redirect to docs/
├── README.md           — GitHub profile README
├── styles.css          — Stale root-level copy (docs/styles.css is canonical)
└── docs/
    ├── index.html      — Main portfolio (~1500+ lines)
    ├── styles.css      — Design system (~1600+ lines)
    ├── script.js       — JS: typewriter, counters, booking modal, Apps Script POST
    └── appsscript.gs   — Google Apps Script booking backend (reference copy)
```

---

## 2. Critical Factual Issues Found

### 2.1 Employment Timeline Inconsistency — HIGH PRIORITY
- Hero chip: `"IBM Consulting · 19+ yrs"` implies unbroken IBM tenure
- Hero card info-row: `"IBM Consulting · 19 yrs 8 mos"` — conflates total IBM tenure across a Mindtree gap (~2014–2016)
- Experience section correctly shows three separate employers (IBM USA, IBM India GDC, Mindtree USA)
- About intro: `"19+ years building mission-critical technology"` — this is accurate because it says "technology experience" not IBM tenure
- **Fix:** Hero chip → `"19+ yrs industry experience"`, Hero card → `"19+ years of enterprise technology"`
- Footer: `"IBM Consulting · 19+ years"` → needs softening
- appsscript.gs email: `"Forward-Deployed AI Architect"` — conflicts with primary title on site

### 2.2 IEEE Membership Number Exposed — HIGH PRIORITY
- Line 506 (awards section): `"IEEE Member – #102577671"` — full member ID publicly displayed
- Tech marquee (×2): `"IEEE Member · Claro Awards Judge"` — no number, acceptable
- Awards section pill previously had `"IEEE Member – #102577671 · 1-Year Milestone"` 
- Awards section card has: `"Member number #102577671"` in body text — **must be removed**
- Contact section: Academic profile card shows `"Member #102577671"` as the `.academic-card-id` — **must be removed**
- **Fix:** Replace all instances with "Active IEEE member" 

### 2.3 Shopify Wording — MEDIUM PRIORITY
- Commerce capability card (line ~670): `"19+ years of verified enterprise commerce delivery spanning IBM WebSphere Commerce, SAP Hybris, Mirakl, and Shopify Plus"`
- **Fix:** Shopify Plus must be labeled as reference architecture, not co-equal with WCS/SAP Hybris (which are confirmed delivery)
- Architecture diagram labeled "Reference Architecture" ✓ — correct
- Commerce section intro references composable commerce as "patterns" ✓ — acceptable
- Case study cards correctly labeled — mostly acceptable

### 2.4 Counter Values Start at "0" — MEDIUM PRIORITY
- `data-target="50" data-suffix="+"` for "Enterprise Projects" — approximate, not verifiable
- `data-target="3524"` for "LinkedIn Followers" — requires constant maintenance  
- `data-target="25" data-suffix="+"` for "Credly Badges" — the Credly page shows 25 badges ✓
- `data-target="6"` for "Verified Awards" — label says "Verified Awards" which must change to "Selected Awards"
- **Fix:** Remove follower counter; harden others to static values with JS animation

### 2.5 Claro Awards — Judging Status Overstated — MEDIUM
- Current text: `"serve as a judge for the 2026 Claro Awards"` — accurate (invitation accepted, post confirmed)
- Award card title: `"Technology Excellence Judge — 2026 Claro Awards"` — acceptable framing
- No claim of evaluations completed ✓
- Missing: explicit status field showing "Invitation accepted · Evaluation in progress"

### 2.6 "Verified" Language — MEDIUM
- Awards section heading: `"Verified Awards"` in stat counter label — must change to "Selected Awards & Recognition"
- Award cards use `.award-card-verified` with green checkmark — class name is fine, but label says "Verified · Physical certificate…" for Albertsons — acceptable (certificate available)
- "Verified · Official IBM certificate" — acceptable
- "Verified · Credly badge" for IEEE — acceptable (Credly badge is public evidence)

### 2.7 Stale/Conflicting Title — MEDIUM
- README.md: `"Forward‑Deployed AI Architect • Enterprise Solution Architect"` — conflicts with site primary title
- appsscript.gs email template line 520: `"Forward-Deployed AI Architect"` — in sent emails
- About intro: correct title ✓
- Hero: correct title ✓

### 2.8 Primary Hero CTA — LOW-MEDIUM
- First CTA button: `"Book a Session"` — plan calls for `"Explore Impact"` / `"View Recognition"`
- Nav: `"Book Session"` prominently in primary nav — should move lower or to secondary

### 2.9 Missing Structured Data — LOW
- No JSON-LD Person schema
- No Open Graph tags
- No canonical URL (relative `docs/` in root is non-standard)
- No sitemap.xml
- No robots.txt

### 2.10 Accessibility Issues — LOW-MEDIUM
- No skip-to-content link
- Counters start from "0" visible before animation — layout shift risk
- No `prefers-reduced-motion` support in CSS for animations
- Form labels present ✓
- Focus states present ✓
- `aria-label` on icon links ✓

### 2.11 Privacy Issues
- IEEE membership number #102577671 exposed (see 2.2) — must be removed
- ORCID `0009-0001-5158-3125` — ORCID IDs are designed to be public ✓
- Google Sheet ID in appsscript.gs — this is a reference copy, not deployed ✓
- Email address in appsscript.gs — reference copy, acceptable ✓

### 2.12 appsscript.gs Security Review
- No input length validation in doPost — MEDIUM risk (formula injection via `=CMD()` payloads)
- No duplicate submission protection — LOW risk
- Error details exposed in response: `JSON.stringify({ status: 'error', message: err.toString() })` — MEDIUM
- No rate limiting — LOW (Apps Script has built-in quotas)
- SHEET_ID committed to public repo — LOW risk (reader needs OAuth to access sheet)
- Formula injection: `sheet.appendRow([data.timestamp, data.name...])` — data not sanitized for `=` prefix

### 2.13 Missing Files
- No `robots.txt`
- No `sitemap.xml`
- No `.gitignore` (private evidence paths not protected)
- No `CONTENT_GAPS.md`
- No `EVIDENCE_MODEL.md`
- No `docs/executive-bio.html`
- No `docs/evidence.html`
- No `docs/data/` directory

### 2.14 README Mismatch
- README title: "Forward‑Deployed AI Architect" conflicts with site
- README tech stack: React, Node.js, Python, Docker, Kubernetes, AWS, PostgreSQL, Terraform — generic, doesn't reflect actual specialization
- README projects: mentions `optimum` repo which is not featured on main site
- Missing: Adobe certifications, IBM commerce experience, awards, community work

---

## 3. What Is Correct and Should Not Change

- Three-pillar positioning (AI + Adobe + Commerce) ✓
- Adobe Certified Master listed first ✓
- Mindtree listed as separate employer with US location (NY/NJ) ✓
- MoMA and Scholastic named as public clients ✓
- IBM client names withheld ✓
- Claro Awards framing as judge (not completed) ✓
- Architecture diagram labeled as reference architecture ✓
- Case study confidentiality notes ✓
- Booking form → Google Apps Script POST with URLSearchParams ✓
- 2 verified testimonials only (no fabricated ones) ✓
- Credly badge count (25+) verifiable ✓
- ORCID / Google Scholar / ResearchGate / IEEE in research profiles ✓

---

## 4. External Link Status

| Link | Status |
|---|---|
| `https://orcid.org/0009-0001-5158-3125` | Expected live |
| `https://scholar.google.com/citations?user=BaZX168AAAAJ` | Expected live |
| `https://www.credly.com/users/a0941b65-1476-47a5-b114-6f67f0c6cd32` | Expected live |
| `https://www.linkedin.com/in/shubhojitchowdhury` | Expected live |
| LinkedIn photo URL (`media.licdn.com/...`) | May expire — CDN-hosted |
| `https://github.com/shubhojit82` | Live ✓ |
| `https://www.researchgate.net/profile/Shubhojit-Chowdhury` | Needs verification |
| Apps Script URL in script.js | Should be live if deployed |

---

## 5. Summary Priority Matrix

| Priority | Issue | Action |
|---|---|---|
| HIGH | IEEE # exposed | Remove from all public HTML |
| HIGH | IBM tenure conflation | Fix hero chip + card + footer |
| HIGH | README title mismatch | Rewrite README |
| MEDIUM | Counter "0" flash | Hard-code values |
| MEDIUM | appsscript formula injection | Add sanitization |
| MEDIUM | Shopify wording | Clarify reference vs. delivery |
| MEDIUM | Missing structured data | Add Person schema, OG tags |
| MEDIUM | No skip link | Add accessibility skip nav |
| MEDIUM | No reduced-motion CSS | Add @media prefers-reduced-motion |
| MEDIUM | Hero CTA = booking | Change to "Explore Impact" |
| LOW | Missing robots.txt, sitemap | Create |
| LOW | No .gitignore | Create |
| LOW | No evidence data files | Create |
