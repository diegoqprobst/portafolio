# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three audiences reach `diegoquinde.com` (the umbrella root), in this order of
commercial priority:

1. **Lighting manufacturers, reps and specifiers** who need technical
   documentation produced: submittals, cut sheets, spec sheets and catalogs
   aligned to IES, NFPA and EN requirements. They arrive mid-task, usually with
   a bid or a deadline, and are evaluating whether this person can be trusted
   with a committee-facing document.
2. **Prospective clients and recruiters hiring for document / data work**
   (Upwork and direct), who need complex research, product data or strategy
   turned into something a team can decide on.
3. **Peers in AI × mental-health research** who arrive for the open-source
   psychotherapy evaluation work. Real audience, but not the audience this
   surface is optimized to convert.

A fourth reader is now first-class: **AI assistants and answer engines**
(ChatGPT, Claude, Perplexity, Google AI surfaces) retrieving and summarizing
the page on a user's behalf. The site must be answerable, not only readable.

## Product Purpose

A single personal domain that presents Diego Quinde's work and converts the two
commercial intents above into contact. It is the public front door for Lumen
Studio (`/lumen`), the case studies (`/saratoga`, `/luxarmonie`), the free lumen
calculator (`/tools/lumen-calculator`) and the private Business OS (`/admin`).

Success on the root surface: a visitor — human or AI assistant — can state
within seconds what Diego does, see proof of it, and reach him.

## Positioning

A clinical psychologist who builds technical systems. The combination is the
mechanism, not a biography detail: clinical training in how people actually
read, decide and resist is what makes the documentation and the AI work land.
A neighbouring documentation studio cannot truthfully claim it, and a
neighbouring AI lab cannot truthfully claim the clinical side.

For the commercial intent, the sharper claim is narrower: technical lighting
documentation produced on an InDesign + AI pipeline, against IES / NFPA / EN
standards, delivered committee-ready.

## Operating Context

- Work is delivered as documents and data: submittals, catalogs, spec sheets,
  decks, publications. InDesign plus AI pipelines; YAML/JSON → PDF engines.
- Clients are reached through Upwork and direct contact by email.
- Diego is based in Miami; clients span the US, France and Ecuador.
- The site is bilingual EN/ES. English is the default audience; Spanish matters
  for LATAM clients and for the Spanish-language AI-evaluation work.

## Capabilities and Constraints

- Next.js 15 App Router, React 19, Tailwind 3, TypeScript, deployed on Vercel.
  `@vercel/analytics` is live. Fonts are self-hosted through `next/font`.
- Routes in place: `/` (umbrella root), `/lumen`, `/saratoga`, `/luxarmonie`,
  `/tools/lumen-calculator`, `/privacidad`, `/checklist` (gated), `/admin`
  (private Business OS, behind auth), `/api/*`.
- The EN/ES toggle is implemented as duplicated `data-en` / `data-es` spans
  hidden by a `lang-*` class on `<body>`. Both languages exist in the DOM.
- `/admin` and `/api` are disallowed in robots.txt and must stay that way.
- Content comes from `lib/featured-work.ts` and `lib/hackathons.ts`; the
  `/lumen` route has editable content behind the admin panel.

## Brand Commitments

- **Name:** Diego Quinde. Studio: Lumen Studio.
- **Mark:** the hummingbird (colibrí) line SVG from Diego's brand manual, kept
  exactly as drawn. It is inlined in `UmbrellaClient.tsx` and in the favicon.
- **Typography (pinned by the user):** Montserrat and Helvetica Neue.
- **Visual world (pinned by the user):** the 1933 Union Carbide "Giants of the
  New Age" exhibit booklet and mid-century technical-catalog printing —
  industrial blue, cream stock, heavy geometric caps, line-engraved diagrams.
  Reference scans live in `/Users/diego/Code/Video Js/`.
- **Voice:** facts first, no hype. Claims carry numbers or standards or they do
  not ship.

## Evidence on Hand

Real, verified, already published on the site:

- **Saratoga Public Lighting Submittal** (2026, US public infrastructure) —
  bid package aligned to municipal, IES and NFPA requirements. Case study at
  `/saratoga`. Saratoga is in Utah, not New York.
- **Luxarmonie Product Intelligence** (2026, lighting e-commerce, France) —
  catalog processing cut from 40 to 10 hours/month at 99.2% data integrity.
  Case study at `/luxarmonie`.
- **Wellness Commerce Sales Deck** (2026) — 14-slide decision deck, $15.4M
  commercial model. PDF at `/wellnova-sales-deck.pdf`.
- **Healthcare IT Leadership Guide** (2026) — 13-page publication. PDF at
  `/agile-transformation.pdf`.
- **Between Sessions** (Agents, Everywhere · AI Tinkerers × OpenAI, Miami,
  2026) — Slack agent accompanying people between therapy sessions.
  Repository: `github.com/diegoqprobst/between-sessions`.
- **LATAM Bank Dispute Agent** (Factored AI & Data Hackathon, 2026) — 230
  sealed conversations, 0 unsafe outcomes, $0.00055 LLM cost per resolution,
  offline synthetic data. Live demo and repository linked.
- Roadmap milestones 2026–2028 for the open psychotherapy benchmark. These are
  stated plans, not shipped artifacts, and must stay marked as plans.
- Contact: `diegoaquinde@gmail.com`. Upwork profile:
  `upwork.com/freelancers/diegoaq`.

Absences future work must not fabricate: no client testimonials, no pricing,
no logos of employers beyond "It's Rappid" and "iWallet" as stated roles, no
published papers yet, no case study for the game.

## Product Principles

1. **Proof before adjective.** Every claim on the page carries a number, a
   standard or a named artifact, or it is cut.
2. **The commercial front door is lighting documentation.** The research and
   the game are real and visible, but they never obscure what can be hired.
3. **Answerable, not only readable.** The page is written so a machine
   retrieving it can state who this is, what he does and how to reach him
   without inference.
4. **Bilingual without duplication penalty.** Spanish is a first-class
   audience; the implementation must not read as duplicate content.
5. **Plans are labeled as plans.** The roadmap is ambition stated honestly, and
   never presented as delivered work.

## Accessibility & Inclusion

No formal standard was established by the user. The incumbent implementation
already ships visible keyboard focus rings and documented contrast ratios, and
honours `prefers-reduced-motion`. Future work preserves both.
