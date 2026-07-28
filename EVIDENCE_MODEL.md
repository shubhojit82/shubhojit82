# Evidence Model — shubhojit82 Portfolio
**Version:** 1.0  
**Purpose:** Define the data schema and evidence classification standards used by this portfolio

---

## 1. Evidence Classification

Every public claim falls into one of these categories:

| Type | Definition | Required Before Publishing |
|---|---|---|
| `publicly-verifiable` | Evidence resolves via public URL | URL must work |
| `certificate-available` | Physical or digital certificate held privately | Must note "certificate available" |
| `confirmation-pending` | Evidence exists but not yet in hand | Must use hedged language |
| `criteria-needed` | Award/role exists but selection process unknown | Note gap in CONTENT_GAPS.md |
| `self-reported` | Based on own recollection or résumé only | Must use "per authorized résumé" |

---

## 2. Implementation Status Labels

Use exactly these labels — no others — when describing work:

| Label | Meaning |
|---|---|
| `Production` | System is live and serving real users |
| `Operational platform` | Internal system running in a production context |
| `Enterprise initiative` | Formal internal IBM or client engagement |
| `Open-source implementation` | Code is public on GitHub |
| `Prototype` | Working code but not in production |
| `Reference architecture` | Design pattern, not a deployed system |
| `Concept` | Idea or paper design, no implementation |

---

## 3. Claim Record Schema

Every significant claim should be traceable to a structured record:

```json
{
  "id": "unique-kebab-case-id",
  "title": "Short display title",
  "organization": "Issuing or client org",
  "date": "YYYY-MM or YYYY",
  "category": "award | role | credential | contribution | community | judging | publication",
  "summary": "One sentence summary",
  "role": "Shubhojit's specific role",
  "contribution": "What he specifically did",
  "outcome": "Verified result (or omit)",
  "scope": "employer | client | industry | community | external",
  "evidenceType": "certificate | linkedin-post | credly-badge | github-repo | public-url | private-certificate",
  "evidenceUrl": "https://... or null",
  "evidenceLabel": "Display text for link",
  "verificationStatus": "publicly-verifiable | certificate-available | confirmation-pending | criteria-needed | self-reported",
  "publicVisibility": true,
  "implementationStatus": "Production | Reference architecture | ...",
  "confidentialityNote": "Client name withheld per IBM delivery confidentiality",
  "lastVerified": "YYYY-MM",
  "tags": ["tag1", "tag2"]
}
```

Only records with `"publicVisibility": true` render on public pages.

---

## 4. Award Record Rules

- Do not use "verified" unless `evidenceUrl` resolves publicly or `evidenceType` is `credly-badge`
- Use exactly: "Evidence available" / "Publicly verifiable" / "Certificate available" / "Confirmation pending"
- Never add "prestigious" or "extraordinary" as editorial narration unless those exact words appear in the issuer's certificate (in which case: quote and attribute)
- Always state the issuer and year
- Always state the reason given by the issuer (or mark as "reason not stated")

---

## 5. Judging Record Rules

Use exactly these status values:

| Status | Meaning |
|---|---|
| `Invited` | Invitation received |
| `Accepted` | Invitation accepted; commitment made |
| `Evaluation in progress` | Actively reviewing submissions |
| `Evaluation completed` | Evaluations submitted |
| `Publicly verified` | Listed on official judge page |

Do not advance to a higher status without evidence.

---

## 6. Commerce Contribution Rules

- Never describe a reference architecture as a client deployment
- Always label Shopify work as "Reference architecture" until a production deployment is confirmed
- IBM WebSphere Commerce implementations may be described as "delivered" (confirmed by client awards, résumé, IBM record)
- Metrics (revenue, traffic, transactions) require independent confirmation before publication
- Client identity may only be named when publicly disclosed (MoMA, Scholastic, Hertz — confirmed via testimonials/résumé)

---

## 7. Files Implementing This Model

```
docs/data/profile.json          — Primary professional identity
docs/data/impact.json           — Critical roles and engagements  
docs/data/contributions.json    — Original architecture contributions
docs/data/recognition.json      — Awards and recognition records
docs/data/judging.json          — Judging service records
docs/data/credentials.json      — Certifications and badges
docs/data/testimonials.json     — Recommendations
docs/data/thought-leadership.json — Publications and presentations
docs/data/community.json        — Community and nonprofit work
```

---

## 8. Private Evidence Safety

The following directories are in `.gitignore` and must NEVER be committed:

```
private-evidence/
private-recommendations/
private-compensation/
private-immigration/
private-client-materials/
```

Original certificates, award letters, and private correspondence must be stored locally only.
