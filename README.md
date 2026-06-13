# NEXUS: The Living Portfolio

An interactive portfolio that maps skills, projects, and ideas as a connected graph.

**Status:** Phase 7 -- Finalisierung & Launch (7.1 + 7.2 done, 7.3-7.12 in progress)

---

## What is NEXUS?

NEXUS is a portfolio, but not the usual one. Instead of a list of projects on a page, it shows everything as a living network. Visitors can move between a force-directed graph and a card grid, filter by type or category, and open detail panels for deeper information.

### Core Features

- **CoreHero** -- BUILDER CORE with typewriter animation, stats counter, mission text
- **Force-directed graph** -- Physics-based layout using d3-force. Pan, zoom, drag, hover highlight.
- **Grid View** -- Toggle to card-based browsing for all nodes
- **FilterBar** -- Filter by type (Skill/Project/Concept), Skill Category, Project Status
- **DetailPanel** -- Slide-in panel from the right with backdrop overlay, Escape key support
- **SkillDetail** -- Circular SVG proficiency gauge, category icons, technologies, related projects
- **ProjectDetail** -- Timeline bar, features checklist, tech stack grid, screenshots, links
- **ConceptDetail** -- Circular SVG feasibility gauge, related skills/projects, concept badge
- **CoreDetail** -- Stats grid, mission statement, connected skills with relation badges
- **"Next Evolution"** -- Dashed-border purple section showing future growth paths in every detail view
- **Project Archive** -- Fullscreen overlay grid for all projects with details, skill pills, tech stack, external links
- **Staggered reveal animations** -- Components fade in with incremental delays on detail content
- **Relation badges** -- Color-coded chips: "powers", "contains", "related-to", "evolves-into"
- **Dark Brutalist / Cyberpunk look** -- Black backgrounds, neon cyan accents, gradient borders
- **BootScreen** -- 6-step cinematic boot sequence with click-to-skip, remembers state in sessionStorage
- **ScanModeButton** -- Three visual states (idle/active/complete) that trigger cluster analysis
- **Scan Mode** -- Highlights 8 clusters one by one (1.5s per cluster), proficiency-based status badges (online/active/prototype/experimental), dims other nodes, pulse-glow effect
- **ContactPanel** -- Centered dialog with Mail/GitHub/LinkedIn, Escape key support

---

## Design System

NEXUS uses a dark brutalist style with neon accents.

| Token      | Value                        |
|------------|------------------------------|
| Background | `#000` (pure black)          |
| Surface    | `neutral-900`                |
| Border     | `neutral-800`                |
| Accent     | `cyan-400`                   |
| Font Mono  | Geist Mono (`--font-mono`)   |
| Danger     | `red-500/600` (404/error)    |

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
+-- app/              # Next.js App Router
|   +-- page.tsx         # Home page
|   +-- layout.tsx       # Root layout (Geist Mono font)
|   +-- globals.css      # Global styles and animations
|   +-- error.tsx        # Error boundary
|   +-- global-error.tsx # Root error boundary (self-contained)
|   +-- loading.tsx      # Loading animation (NEXUS Pulsar)
|   +-- not-found.tsx    # 404 page
+-- components/       # 22 React components
|   +-- BootScreen.tsx   # Boot sequence
|   +-- CoreHero.tsx     # Hero section with stats
|   +-- FilterBar.tsx    # Type / Category / Status filters
|   +-- NexusExplorer.tsx # Main explorer
|   +-- NexusGraph.tsx   # Force-directed graph (d3)
|   +-- GraphNode.tsx / GraphEdge.tsx
|   +-- NodeCard.tsx     # Dispatches to SkillCard / ProjectCard / ConceptCard
|   +-- SkillCard.tsx / ProjectCard.tsx / ConceptCard.tsx
|   +-- DetailPanel.tsx  # Slide-in panel
|   +-- SkillDetail.tsx / ProjectDetail.tsx / ConceptDetail.tsx / CoreDetail.tsx
|   +-- ProjectArchive.tsx # Fullscreen archive
|   +-- ScanModeButton.tsx
|   +-- ContactPanel.tsx
|   +-- ViewToggle.tsx
+-- data/             # Static data
|   +-- nodes.json      # Node definitions
|   +-- edges.json      # Edge definitions
|   +-- projects.json   # Extended project details
+-- lib/              # Core logic
|   +-- types.ts        # TypeScript types
|   +-- utils.ts        # Data loading, validation, helpers
|   +-- style-helpers.ts # Colors, badges, gauge thresholds
|   +-- constants.ts
|   +-- force-layout.ts  # d3-force simulation
+-- tests/            # 125+ tests
|   +-- lib/            # Unit tests
|   +-- components/     # Component tests (Vitest + Testing Library)
|   +-- data-model.test.ts
|   +-- data-validation.test.ts
|   +-- integration.test.ts
|   +-- utils.test.ts
|   +-- graph.test.tsx
+-- public/           # Static files
+-- docs/             # Architecture docs (local only)
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
npm test         # run all tests (Vitest)
```

---

## Development Phases

| Phase | Scope                              | Status      |
|-------|------------------------------------|-------------|
| 1     | Next.js scaffold                   | Done        |
| 2     | Data model and content foundation  | Done        |
| 3     | Core UI components (cards, filter) | Done        |
| 4     | Interactive graph (force-layout)   | Done        |
| 5     | Detail views and polish            | Done        |
| 6     | Bootscreen, Scan Mode, Contact     | Done        |
| 7     | Search, animations, responsive     | In Progress (7.1 + 7.2 done) |
| 8     | Accessibility and QA               | Planned     |
| 9     | Performance and deployment         | Planned     |

---

## License

MIT
