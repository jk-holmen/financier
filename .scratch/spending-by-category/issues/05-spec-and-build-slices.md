# Grilling: spec layout and build slices

Type: grilling
Status: resolved
Blocked by: 04
Part of: [Spending by category](../map.md)

## Question

How is the spec (`.scratch/spending-by-category/spec.md`, the map's destination) laid out, and how is the report split into build slices, each independently buildable and reviewable, for `/to-tickets`?

- which slices, and in what order: e.g. the calculation service with its tests → the chart directive → the period tabs and cards → zoom → translations (8 languages) → the menu entry, the route and removal of the tree map copy
- which slices go in which upstream PR. Per [Grilling: starting point for the build](04-build-starting-point.md), there are two: "Migrate net worth chart to Chart.js 4" first, then "Spending by category". That includes the branch set-up and toolchain check as the first slice, and how the migration PR is checked (the net worth chart behaves as before)
- what each slice's acceptance check is (unit tests for the calculation; what is checked by hand for the UI)
- what the spec gathers from the closed tickets versus links to them, so each decision still lives in one place

## Answer

Settled in one grilling session (2026-11-07). Written up in [the spec](../spec.md).

- **The spec stands alone.** It states every requirement as the build contract, and each section links to the ticket that holds the *why* and the rejected options. The prototype branch is linked as a reference for the hover/leave fix and the colour maths, not copied in.
- **PR 1, "Migrate net worth chart to Chart.js 4", has two slices:** "Sync fork and check upstream toolchain" (AFK: install, dev server, tests and lint pass on clean upstream `main` with no workarounds; record the Node version), then "Migrate net worth chart".
- **The migration is checked by:** tests and lint passing; side-by-side screenshots of the net worth report on upstream `main` and on the branch, with the same budget, showing the same bars, line, axes, tooltip text, colours and dark mode; the bundle size change noted. The screenshots go in the PR.
- **PR 2, "Spending by category", is built as vertical slices**, each usable in the app: 1 calculation service + unit tests → 2a page shell (route, menu, period tabs, cards, totals, empty states, stacking) → 2b tree maps (dependency, directive, colours, labels, basic tooltip) → 3 zoom and 4 hover, which are independent of each other once 2b lands.
- **Translations:** there is no fallback language, so a missing key shows up raw. Each slice adds its own keys in all 8 files. The agent drafts the non-English text, and the PR says which languages are machine-drafted and asks for native review. The user checks `sv` and `no`.
- **UI acceptance** is a manual checklist per slice, checked in the running app with screenshots. No directive test harness. Pure helpers (period → months, colour map, zoom filtering, share/tooltip text) live outside the directive and are unit-tested with the service.
- **The spec is written in the same session** that resolved this ticket, since nothing was left to decide.
