# Correction Report — Credibility & Consistency Pass

**Branch:** `feature/evidence-first-profile`  
**Date:** 2025-05-10  
**Status:** Implemented and committed

---

## Files Modified

| File | Changes |
|------|---------|
| `docs/index.html` | Shopify wording, MoMA/Mindtree, award terminology, research section, service card wording, page title |
| `docs/evidence.html` | Removed placeholder banner, replaced IBM award cards with confirmed records, corrected MoMA card, corrected Sreeshti status, corrected all verification labels |
| `docs/executive-bio.html` | Removed "IBM Consulting" from meta line, corrected MoMA recognition line |
| `docs/data/recognition.json` | Full rewrite — accurate records with confirmed dates, removed PLACEHOLDER fields, corrected MoMA entry to Mindtree |
| `README.md` | Full rewrite — correct primary identity, added Shopify reference-architecture disclaimer, removed "Forward-Deployed AI Architect", correct award table, accurate repo type labels, research-profiles caveat |

---

## 1. Shopify Claims Corrected

| Location | Previous | Corrected |
|----------|----------|-----------|
| `index.html` pillar-desc (line ~274) | "19+ years of verified enterprise commerce delivery spanning IBM WebSphere Commerce, SAP Hybris, Mirakl, and Shopify Plus" | "19+ years of enterprise commerce delivery across IBM WebSphere Commerce, SAP Hybris, Mirakl, Sterling OMS, and related enterprise platforms, complemented by Shopify Plus and composable-commerce reference architecture expertise" |
| `index.html` commerce cap card title | "Shopify Platform Architecture" | "Shopify Reference Architecture" |
| `index.html` commerce cap card desc | "Designing Shopify and Shopify Plus ecosystems for enterprise use" | "Designing reference architectures and integration blueprints for enterprise Shopify and Shopify Plus ecosystems" |
| `index.html` Enterprise Integration cap | "Connecting Shopify to ERP…" | "Integration blueprints for connecting Shopify to ERP…" |
| `index.html` Mobile Commerce cap | "Reference architecture for…apps integrating with Shopify" | "Composable-commerce architecture pattern for…apps integrating with Shopify" |
| `index.html` Enterprise Commerce Foundation | "19+ years of verified enterprise commerce delivery" | "19+ years of enterprise commerce delivery across…" |
| `README.md` | No Shopify disclaimer | Added explicit note: *"Shopify content is presented as reference architecture and integration blueprints, not as a claimed production client deployment."* |

---

## 2. MoMA Records Corrected

All instances now consistently identify this as a Mindtree US engagement, not IBM Consulting.

| Location | Previous | Corrected |
|----------|----------|-----------|
| `index.html` case-study challenge | "High-performance search transformation for the MoMA online store" | "MoMA E-Commerce Search Transformation — Mindtree US" |
| `index.html` award card title | "Hats Off Award — MoMA New York" | "Mindtree Hats Off Award — MoMA E-Commerce Search" |
| `index.html` award card desc | "for extraordinary results on the Nextopia search integration" | "The award citation recognized the work for 'extraordinary results.'" (attributed quotation only) |
| `index.html` award card status | "Verified · Client publicly named (MoMA) · Authorized résumé" | "Certificate available · Client publicly named · Authorized résumé" |
| `index.html` case-study note | "Hats Off Award is a verified Mindtree recognition" | "Hats Off Award — Mindtree US practice, May 2016. Certificate available." |
| `docs/evidence.html` | "MoMA Digital Transformation — Project Architect" / org: "MoMA / IBM Consulting" | "Mindtree Hats Off Award — MoMA E-Commerce Search" / org: "MoMA E-Commerce Search Transformation — Mindtree US · May 2016" |
| `docs/executive-bio.html` | "MoMA Digital Transformation — project architect recognition" | "Mindtree Hats Off Award — MoMA E-Commerce Search Transformation (May 2016)" |
| `docs/data/recognition.json` | `"org": "MoMA / IBM Consulting"`, `"title": "MoMA Digital Transformation — Project Architect"` | `"org": "Mindtree US Practice"`, `"title": "Mindtree Hats Off Award — MoMA E-Commerce Search Transformation"` |
| `README.md` | "MoMA Digital Transformation — Project architect recognition" | "MoMA E-Commerce Search Transformation (Mindtree US) — Nextopia search integration for the Museum of Modern Art online store (2016)" |

---

## 3. Evidence Center Placeholders Removed

| Item | Action |
|------|--------|
| `"Content in progress."` banner | Removed entirely. Replaced intro with: *"Selected professional recognition, credentials, service, and contribution records supported by available documentation or public sources."* |
| "IBM GBS GD Top Contributor Award" (no year) | Replaced with confirmed **GIC Onsite Assignee — Top Contributor Award (TCA), For Year 2013** — year confirmed from award letter in main portfolio |
| "IBM Eminence & Excellence Recognition" (no year) | Replaced with confirmed **GBS-GD Eminence & Excellence Recognition, 2012–2014 era** — date range confirmed from award letter in main portfolio |
| "Certificate available — year to be confirmed" status labels | Removed. Cards now use proper status: "Official letter available · Signed by two General Managers" and "Certificate available · Signed by GM Global Delivery India" |
| "Public URL to be confirmed" (Sreeshti) | Removed. Replaced with neutral "Active role" status indicator |

---

## 4. Award Verification Terminology Corrected

All "Verified ·" prefixes replaced with approved status labels:

| Previous | Corrected |
|----------|-----------|
| "Verified · Physical certificate presented by client leadership" | "Certificate available · Physical certificate presented by client leadership" |
| "Verified · Official IBM certificate signed by GM Global Delivery India" | "Certificate available · Official IBM certificate signed by GM Global Delivery India" |
| "Verified · Official IBM letter signed by two General Managers" | "Official letter available · Signed by two General Managers" |
| "Verified · Client publicly named (MoMA) · Authorized résumé" | "Certificate available · Client publicly named · Authorized résumé" |
| "Verified · Client publicly named · Authorized résumé" (evidence.html) | "Certificate available · Client publicly named · Authorized résumé" |
| Section subtitle: "Verified awards from IBM, clients, and industry bodies" | "Selected awards and professional recognition from clients, employers, and industry organizations" |

---

## 5. Unsupported Adjectives Removed

| Location | Term removed | Action |
|----------|-------------|--------|
| `index.html` timeline Mindtree | "prestigious Mindtree Hats Off Award" | "Mindtree Hats Off Award" — removed "prestigious" |
| `index.html` timeline Mindtree | "extraordinary results" as editorial narration | Converted to attributed quotation: *"The award citation recognized the work for 'extraordinary results'"* |
| `index.html` case-study desc | "for extraordinary results on the…" | "The award citation recognized the work for 'extraordinary results.'" |
| `README.md` | "MoMA Digital Transformation" as free-standing claim | Full Mindtree-attributed description |

---

## 6. Research Section Changes

| Location | Previous | Corrected |
|----------|----------|-----------|
| `index.html` section-label | "Academic & Research Profiles" | "Research Profiles" |
| `index.html` h2 | "Research Identity & Scholarly Presence" | "Research Profiles" |
| `index.html` (new intro) | *(none)* | Added: *"Research identifiers have been established in preparation for upcoming technical publications. Published work and citation information will be added after release and indexing."* |
| `index.html` ORCID card desc | "unique persistent identifier linking research output and scholarly activity" | "persistent identifier established for upcoming technical publications" |
| `index.html` Scholar card desc | "Scholar profile tracking citations, publications, and academic contributions indexed by Google" | "Google Scholar profile established for indexing of upcoming technical publications" |
| `index.html` ResearchGate card desc | "Research network profile for academic publications, papers, and scholarly engagement with the global research community" | "ResearchGate profile established for upcoming technical publications and professional networking" |
| `README.md` | Research profiles listed without caveat | Section headed "Research Profiles" with explicit note about upcoming publications |

---

## 7. GitHub README Changes

| Previous | Corrected |
|----------|-----------|
| "Forward-Deployed AI Architect" as identity *(had been corrected in prior session but README was rebuilt here)* | "Enterprise AI, Digital Experience & Commerce Architect" |
| No Shopify reference-architecture disclaimer | Explicit disclaimer added under Shopify section |
| IBM award table with PLACEHOLDER years | Confirmed years from award letters used throughout |
| "MoMA Digital Transformation — Project architect recognition" | "MoMA E-Commerce Search Transformation (Mindtree US)" |
| No IBM/Mindtree distinction | Positioning explicitly states: "19+ years of technology experience across IBM Consulting (current) and Mindtree USA (~2014–2016)" |
| Repository table without type labels | Each repo labeled: Reference architecture / Operational platform / Prototype / Training material |
| Research profiles with no caveat | Section note: *"Research identifiers have been established in preparation for upcoming technical publications."* |

---

## 8. Timeline / Employment Consistency Changes

| Location | Previous | Corrected |
|----------|----------|-----------|
| `index.html` page `<title>` | "… Commerce Architect · IBM Consulting" | "… Commerce Architect" — IBM Consulting removed from title |
| `executive-bio.html` bio-meta | "IBM Consulting · 19+ years of enterprise technology experience" | "19+ years of enterprise technology experience" |
| `index.html` service cards (×2) | "19+ years of IBM delivery experience" / "19+ years of IBM enterprise delivery" | "19+ years of enterprise technology experience" |
| `README.md` positioning | No explicit IBM/Mindtree distinction | Added: IBM Consulting (current) and Mindtree USA (~2014–2016) named separately |

---

## 9. Privacy Corrections

No new IEEE member numbers or other private identifiers were found. Prior-session corrections remain intact:

- IEEE member number `#102577671` — confirmed absent from all public HTML, JSON, and README
- All academic profile cards show "Active IEEE Member" only

---

## 10. Counter & Crawlability Fixes

No new counter issues were found. Prior-session fixes remain intact:

- All stat counters have hard-coded initial values (`19+`, `25+`, `6`, `4`) — no "0" flash
- `<noscript>` fallback: core professional facts are present as real HTML text before JS executes
- JSON-LD Person schema, OG tags, canonical URL, and Twitter Card tags remain from prior session

---

## 11. Broken / Misleading Links Reviewed

| Link | Status | Action |
|------|--------|--------|
| `https://orcid.org/0009-0001-5158-3125` | Resolves to valid ORCID profile | Retained |
| `https://scholar.google.com/citations?user=BaZX168AAAAJ&hl=en` | Resolves to valid Scholar profile | Retained |
| `https://www.researchgate.net/profile/Shubhojit-Chowdhury` | Resolves to valid ResearchGate profile | Retained |
| `https://www.linkedin.com/in/shubhojitchowdhury` | Valid LinkedIn profile | Retained |
| `https://github.com/shubhojit82` | Valid GitHub profile | Retained |
| `https://www.credly.com/users/a0941b65-1476-47a5-b114-6f67f0c6cd32/badges/credly` | Credly profile link (in credentials section) | Retained — points to Credly profile, not a generic org page |
| `https://www.ieee.org/membership/member-directory.html` | IEEE member directory (generic org page) | Retained as profile pointer — does not claim personal evidence |
| `https://48in48.org` | Resolves to valid org website | Retained |
| All GitHub repo links (AIAssistant, edge-delivery, nabc-2026, hackathon2021, trainingGHA) | All resolve to public repos | Retained |

---

## Remaining Content Gaps (for Shubhojit's action)

These items are tracked in `CONTENT_GAPS.md` and are NOT displayed publicly until confirmed:

| Item | Status | Action Required |
|------|--------|----------------|
| Credly badge URL — Adobe Certified Master | Not yet linked | Add direct Credly badge URL to `docs/data/credentials.json` and portfolio |
| Credly badge URL — IEEE 1-Year Milestone | Not yet linked | Add direct Credly badge URL |
| Testimonial quotes (Rahul Nair, Greg Williams) | Quotes not yet obtained | Request explicit written permission from each recommender before publishing publicly |
| Sreeshti public URL | Not confirmed | Add org website URL when available |
| CAB board name and description | Not confirmed | Confirm board name and description |
| Anandamandir / Kallol description | Not confirmed | Add description of role and engagement |
| Education (degree, institution, year) | Not disclosed | Add to `docs/data/credentials.json` if to be disclosed |
| LinkedIn post URL — Claro Awards | Not linked | Add direct URL to LinkedIn post for Claro Awards judging |

---

## Manual Actions Required from Shubhojit

1. **Credly badge URLs** — Log in to Credly, copy the direct share URL for the Adobe Certified Master badge and the IEEE 1-Year Milestone badge. Add to `docs/data/credentials.json` and link from the main portfolio.

2. **Testimonial permission** — Before publishing any LinkedIn recommendation quotes publicly, obtain explicit written permission from Rahul Nair and Greg Williams MBA. Until then, the testimonials section shows only the CTA to the LinkedIn profile.

3. **Sreeshti URL** — Confirm whether Sreeshti has a public website. If yes, add the URL to `docs/data/community.json` and link it in the Evidence Center.

4. **LinkedIn post URL** — Add the direct LinkedIn post URL for the Claro Awards judging acknowledgement to `docs/data/recognition.json` `evidence` field and to the Claro card in `docs/index.html`.

5. **Review the Albertsons award card** in `docs/evidence.html` — the card is present but not yet added to the Evidence Center page. If the client award should be publicly displayed, add the card using the same pattern as other award cards (with `Certificate available` status).

6. **Test Credly link** — The credentials section links to `https://www.credly.com/users/a0941b65-1476-47a5-b114-6f67f0c6cd32/badges/credly`. Confirm this URL still resolves and shows the correct profile.

7. **Merge branch** — When content review is complete, merge `feature/evidence-first-profile` into `main` and confirm GitHub Pages deploys the updated site.
