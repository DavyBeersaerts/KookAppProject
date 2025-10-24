 1) Overview
Product name: Rox & Me
One-line summary: A privacy-first SaaS meal-planning app for couples that stores recipes, plans weekly dinners around your schedules, and generates a consolidated, category-grouped shopping list—accessible on desktop and mobile, EU-hosted. Belgian-first, expand later.
Problem statement: Planning dinners and shopping is time-consuming. You need a single place to save recipes, auto-plan dinners around availability, and generate a one-trip shopping list grouped by store categories for faster shopping. Grocery API connections can arrive later.
Target users/personas:
Primary: Couples in Belgium (you and Rox), shopping in local Belgian stores.
Secondary: Small households wanting shared planning and synced lists across devices.
Goals:
P0: Recipe management (URL import, AI extraction, manual) with photos
P0: Weekly “Spin the Wheel” + Single-meal quick spin
P0: Consolidated shopping list grouped by store category/aisle, with pantry checks
P0: EU data residency for all user data
P1: Calendar alignment (Google first)
P2: Grocery connections (AH/Delhaize/Colruyt) via Settings > Connections (moved to Beta/Later)
Pricing/Plans: Single plan at launch; architecture ready for future tiers.
Non-goals (initial): Allergen warnings, nutrition tracking, budgeting, lunch (later phase), immediate grocery ordering APIs (deferred to Beta or later).
Success metrics:
Primary: Weekly plan creation and acceptance rate
Secondary: Import edit rate; list completion rate; time-to-shop reduction; active days/week; cross-device sessions
2) Use Cases & User Stories
UC-1: Add/manage recipes with images (multi-device)
UC-2: Import via URL; AI extracts structured recipe
UC-3a: Spin full-week plan honoring availability and variety rules
UC-3b: Spin single-meal quick pick (no shopping/ordering unless requested)
UC-4: Generate consolidated shopping list grouped by store category/aisle; de-dup + normalize units; pantry checks
UC-5 (Later): Choose grocer (via Connections), check availability, suggest substitutions, place order
UC-6 (SaaS): OAuth-first signup (Google), invite partner, shared household space; desktop and mobile with synced state
UC-7 (Compliance): All data stored and processed in EU regions
Acceptance criteria (highlights):
Shopping list is grouped by category/aisle with Belgian-first taxonomy (produce, bakery, charcuterie, dairy, frozen, pantry, beverages, household, personal care, etc.).
Users can switch between “By Category” and “By Recipe” views; items show recipe origin.
Unit normalization (g↔kg, ml↔l; packs→units) and de-dup across recipes.
Pantry toggles exclude items from the list and persist per household.
Single-meal spin does not change the weekly plan unless explicitly added.
EU-only data residency (DB, files, logs, backups).
3) Key Workflows
Recipe intake:
URL → fetch HTML → AI parse → preview/edit → save with photo
Manual entry: title, tags, servings, time, ingredients, steps, photo
AI from free text/photo (e.g., handwritten card) → structured recipe
Spin Week (weekly plan):
Set availability (manual or via Google Calendar)
Apply variety rules and preferences
Spin → propose 7 dinners → lock/swap per day → finalize → generate list
Single-meal spin (quick pick):
Tap “Spin 1 Dinner” → apply rules → show suggestion → re-spin/swap
Optional: add to plan or create a list for this meal only
Shopping list (Belgian-first category grouping):
Consolidate and normalize ingredients → assign categories/aisles
Group list by category; show per-item notes/substitutes and recipe mapping
Pantry check toggles; mark items as obtained; export/share
Optional view: “By Recipe” and “All Items”
Edge cases:
Ambiguous ingredient categories → quick re-categorize
Missing units/quantities → prompt defaults; highlight for review
Offline mobile → read-only cached list with check-off; sync when online
4) Requirements
Functional (priorities):
F-1 (P0): Manual recipe creation with photo upload
F-2 (P0): URL import with AI extraction and editable preview
F-3a (P0): Weekly Spin honoring availability + variety
F-3b (P0): Single-meal spin without list/order by default
F-4 (P0): Shopping list generation with unit normalization and de-duplication
F-5 (P0): Category-grouped shopping list (Belgian-first taxonomy), toggle between Category/Recipe views
F-6 (P0): Pantry toggles, per-item notes/substitutes
F-7 (P0): OAuth-first authentication (Google at MVP), households, partner invites
F-8 (P0): Responsive desktop + mobile web app (PWA), real-time sync
F-9 (P0): EU data residency for all data (DB, files, logs, backups)
F-10 (P1): Google Calendar integration for availability and delivery suggestions
F-11 (P2 - Beta/Later): Connections platform (Settings > Connections) to add/manage grocer APIs; grocery ordering flows
Guardrails:
Single-meal spin never alters the weekly plan unless explicitly added
Explicit confirmation before any future order/checkout features (when added)
Strict tenant isolation; no cross-household access
No secrets exposed in UI; rotation supported (when Connections arrive)
Non-functional:
Performance: <2s typical UI actions; <10s AI import; <2s sync
Reliability: 99.5% uptime
Security: OAuth/OIDC; TLS; role-based access in household
Privacy/Compliance: GDPR, EU data residency; encryption at rest; DPA readiness
Observability: EU-hosted tracing/logging/metrics; audit trails
Accessibility: WCAG AA
Cost targets: <$0.10 per recipe import; <$0.03 per weekly plan
5) AI/ML Design
Tasks:
Extraction: LLM-based structured recipe parsing (Schema.org Recipe)
Planning: Constraint-based generation with seeded randomness and calendar awareness (when connected)
Normalization: Unit conversion and dedup; ingredient→Belgian category/aisle mapping
Variety rules (defaults):
Cuisine diversity: avoid same cuisine two days in a row
Protein rotation: ≤2 per primary protein/week
Starch rotation: ≤2 pasta/week; rotate rice/potato/pasta
Prep-time mix: ≥2 quick (<30 min) per week; allow 1 long cook
No exact repeats within 14 days; respect out-of-home days
Prompting strategy:
System prompts produce strict JSON schemas for recipes, plans, and normalized list items with category suggestions
Few-shot examples with Belgian product/category hints (e.g., “charcuterie,” “versafdeling”)
Memory strategy:
Long-term: recipes DB, pantry state, user preferences
Session: current import/plan context
Evaluation:
Offline: gold set of mixed Belgian/European recipes for extraction and categorization
Online: import edit rate, plan acceptance, category mapping correction rate
Safety:
Allergen detection omitted by design in MVP
6) Data and Integrations
Data models:
Tenant/Household: id, settings (default view, variety toggles)
Users: id, OAuth identity (Google at MVP), membership, roles
Recipes: title, tags, servings, times, ingredients[{qty, unit, item}], steps, photos, source URL
Plans: week_id, days[{date, recipe_ref, notes}]
Pantry: item, qty, unit, last_updated
Shopping lists: items[{ingredient, qty, unit, category, recipe_refs, notes, obtained}]
Integrations:
Auth: OAuth-first (Google MVP; Apple later)
Calendar: Google (P1); iCloud/Outlook later
Grocery Connections: deferred to Beta/Later
Exports: CSV, shareable text, printable view
EU data residency:
Host app, DB, object storage, caches, logs, backups in EU regions
Vendors (email/push/monitoring) must support EU processing and DPAs
Rate limits & caching:
Per-tenant quotas; cache parsed recipes per URL; backoff for external calls
7) UX and Interaction Model
Platforms: Responsive web app (desktop + mobile), PWA for installable mobile experience
Core screens:
Recipes Library (grid with photos)
Add Recipe (URL/manual/AI)
Planner: Spin Week + Spin 1 Dinner; lock/swap; availability chips
Shopping List: Category view (default, Belgian-first), Recipe view, Pantry toggles, Notes, Export
Settings: Account, Household, Preferences; Connections section present but marked “Coming in Beta”
Interaction details:
Category view groups items under Belgian aisles; supports drag-and-drop re-categorization
Each item shows normalized qty, unit, and which recipes need it
Quick actions: “Half/Double qty,” “Mark obtained,” “Move to Pantry”
Accessibility: High-contrast mode, scalable fonts, keyboard navigation
8) System Architecture (High-Level)
Frontend: React/Next.js; Tailwind/Chakra; PWA (service worker, offline cache, push)
Backend: Node.js (NestJS) or Python (FastAPI); REST/GraphQL; WebSockets for live sync
Storage: Postgres with Row-Level Security (multi-tenant); S3-compatible storage (EU) for photos
AI Layer: Model router; embeddings for ingredient→category mapping; cost-efficient models for normalization
Multi-tenancy: Tenant-aware tokens; RLS; per-tenant quotas
Observability: EU-hosted OpenTelemetry; logs; metrics; audit trails
Future Connections (Beta/Later): Provider adapters for grocers; OAuth/API key broker; substitution/availability modules
9) Rollout Plan
MVP (Weeks 1–4):
OAuth-first auth with Google
EU data residency enforced
Households + partner invites
Responsive desktop + mobile app (+ PWA)
Manual recipe entry + photos; URL import with AI extraction + editable preview
Weekly Spin + Single-Meal Spin (manual availability)
Shopping list: category-grouped (Belgian taxonomy), recipe mapping, pantry toggles, CSV/export
Real-time sync for lists and plans
Beta (Weeks 5–8):
Google Calendar integration for availability
Improved unit normalization and category mapping; drag-and-drop re-categorization
Notifications (plan finalized)
Surface Settings > Connections as “Beta” with no or limited providers
GA (Weeks 9–12):
Polish Belgian category taxonomy and localization
Printable list and better sharing options
Prepare groundwork for first grocer connection (design + adapter interface), but keep disabled until ready
10) Risks and Mitigations
Category mapping accuracy → Allow quick re-categorization; learn from corrections; per-household overrides
AI extraction variability → Schema validation; manual edit fallback; caching by URL
Multi-tenant security → RLS; tenant-scoped tokens; penetration testing
Cross-device consistency → Websocket retries; optimistic updates; conflict prompts
Scope creep toward grocer APIs before foundations are solid → Keep Connections behind Beta flag; focus on robust category-based lists first
11) Analytics and Reporting
Dashboards:
Plans created and accepted; import edit rate
List completion rate; average re-categorizations per list
Active days/week; cross-device sessions
Experiments:
Variety rule tuning; category mapping improvements
Category ordering for fastest in-store routes (later)
Feedback loops:
Thumbs up/down on imports and spins; quick “wrong category” feedback on list items
12) Open Questions and Assumptions
Assumptions:
Belgian-first category taxonomy is sufficient for MVP; expand to NL/FR/DE later
Google auth at MVP; Apple and others later
Grocery Connections postponed to Beta/Later; UI shows “Coming soon” only