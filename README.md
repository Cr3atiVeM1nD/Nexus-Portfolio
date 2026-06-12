# NEXUS: The Living Portfolio

An interactive portfolio that visualizes a builder identity as a dynamic knowledge graph — skills, projects, and future concepts connected in a living network.

**Status:** Phase 6 — Bootscreen, Scan Mode & Contact Node ✅

---

## What is NEXUS?

NEXUS is not a normal portfolio. It is a futuristic, interactive skill, project, and idea network in the browser. Instead of a simple list of projects, visitors explore a living system:

### Core Features
- **CoreHero** — BUILDER CORE with Typewriter animation, stats counter, mission statement
- **Force-directed graph** — Physics-based layout with d3-force, pan/zoom/drag, hover highlighting
- **Grid View** — Card-based browsing toggle for all nodes
- **FilterBar** — Filter by type (Skill/Project/Concept), Skill Category, Project Status
- **DetailPanel** — Slide-in panel from right with backdrop overlay, Escape-key support, smooth transitions
- **SkillDetail** — Circular proficiency gauge (SVG), category icons, technologies, related projects/concepts/skills
- **ProjectDetail** — Timeline bar with gradient, features checklist, tech stack grid, screenshots, links
- **ConceptDetail** — Circular feasibility gauge (SVG), related skills/projects, concept badge
- **CoreDetail** — Stats grid (Skills/Projects/Concepts), mission statement, connected skills with relation badges
- **"Next Evolution"** — Dashed-border purple section in every detail view showing future growth paths
- **Project Archive** — Fullscreen overlay grid exploring all projects with details, skill pills, tech stack, and external links
- **Staggered reveal animations** — `animate-slide-up` with incremental delays on all detail content
- **Relation badges** — Color-coded chips for "powers", "contains", "related-to", "evolves-into"
- **Dark Brutalist / Cyberpunk aesthetic** — Black backgrounds, neon accents, gradient borders
- **BootScreen** — 6-step cinematic initialization sequence with click-to-skip and sessionStorage persistence
- **ScanModeButton** — 3 visual states (idle/active/complete) triggering sequential cluster analysis
- **Scan Mode** — Highlights 8 clusters sequentially (1.5s per cluster), proficiency-based status badges (online/active/prototype/experimental), node dimming and pulse-glow effects
- **ContactPanel** — Centered dialog with Mail/GitHub/LinkedIn contact methods, Escape-key support, smooth backdrop overlay

---

## Tech Stack

| Layer      | Technology                  |
|------------|-----------------------------|
| Framework  | Next.js 16                  |
| UI         | React 19 + TypeScript 5     |
| Styling    | Tailwind CSS 4              |
| Graph      | d3-force                    |
| Icons      | lucide-react                |
| Data       | Static TS/JSON files        |
| Testing    | Vitest + Testing Library    |
| Target     | Vercel / Cloudflare         |

---

## Project Structure

```
nexus-portfolio/
├── app/              # Next.js App Router (page, layout, globals.css)
├── components/       # 20 React components
│   ├── BootScreen.tsx # Cinematic initialization sequence
│   ├── CoreHero.tsx   # Hero section with stats
│   ├── FilterBar.tsx # Type / Category / Status filters
│   ├── NexusExplorer.tsx # Main explorer orchestrator
│   ├── NexusGraph.tsx # Force-directed graph (d3)
│   ├── GraphNode.tsx / GraphEdge.tsx # Graph primitives
│   ├── NodeCard.tsx  # Dispatcher → SkillCard / ProjectCard / ConceptCard
│   ├── SkillCard.tsx / ProjectCard.tsx / ConceptCard.tsx
│   ├── DetailPanel.tsx # Slide-in panel container
│   ├── SkillDetail.tsx / ProjectDetail.tsx / ConceptDetail.tsx / CoreDetail.tsx
│   ├── ProjectArchive.tsx # Fullscreen archive overlay
│   ├── ScanModeButton.tsx # 3-state scan mode trigger
│   ├── ContactPanel.tsx   # Centered contact dialog
│   └── ViewToggle.tsx
├── data/             # Static data sources
│   ├── nodes.json    # Node definitions (core, skills, projects, concepts)
│   ├── edges.json    # Edge definitions (relations between nodes)
│   └── projects.json # Extended project details (timeline, tech stack, links)
├── lib/              # Core logic & utilities
│   ├── types.ts      # TypeScript type definitions
│   ├── utils.ts      # Data loading, validation, lookup helpers
│   ├── style-helpers.ts # Relation badges, gauge colors, status styles
│   └── constants.ts     # Shared constants
├── tests/            # 125 tests across 18 test files
│   ├── lib/            # Unit tests for lib modules
│   ├── components/     # Component tests (Vitest + Testing Library)
│   ├── data-model.test.ts
│   ├── data-validation.test.ts
│   ├── integration.test.ts
│   ├── utils.test.ts      # Data loading & lookup helpers
│   └── graph.test.tsx     # Graph & view rendering tests
├── public/           # Static assets (favicon, etc.)
├── docs/             # Architecture & planning (local only)
├── next.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
└── .gitignore
```

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build    # production build
npm run lint     # lint check
npm test         # run all 125 tests (Vitest)
```

---

## Development Phases

| Phase | Scope                              | Status      |
|-------|------------------------------------|-------------|
| 1     | Next.js scaffold                   | ✅ Done     |
| 2     | Data model & content foundation    | ✅ Done     |
| 3     | Core UI components (cards, filter) | ✅ Done     |
| 4     | Interactive graph (force-layout)   | ✅ Done     |
| 5     | Detail views & polish              | ✅ Done     |
| 6     | Bootscreen, Scan Mode & Contact    | ✅ Done     |
| 7     | Search, animations, responsive     | ⬜ Planned  |
| 8     | Accessibility & QA                 | ⬜ Planned  |
| 9     | Performance & deployment           | ⬜ Planned  |

---

## License

MIT
