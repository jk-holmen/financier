# Map: Spending by category

## Destination

An implementation-ready spec (`.scratch/spending-by-category/spec.md`, ready for `/to-tickets`) for a **"Spending by category"** report: two nested tree maps, Budgeted and Outflow per category, for a chosen report period. It answers the original project's request for a spending-by-category report and is meant to be contributed upstream.

## Notes

- **Domain:** Financier's budgeting model. Use the vocabulary in `CONTEXT.md` (master category, category, Budgeted, Outflow, report period).
- **Skills:** grilling tickets call `grilling` and `domain-modeling`; prototype tickets call `prototype`.
- **Upstream-bound:** add translation keys for every new label, keep dependencies minimal and justified, and keep the PR small. Leave anything optional for follow-ups.
- **Upstream baseline** (checked 2026-11-05): `financier-io/financier` `main` is at 1.11.1 (`299b120`), 15 commits ahead of this fork. The branch forked from `4ecd97c` (2024-11-03). None of those commits touch reports, `Month`, `MonthCategory` or `Category`, and Chart.js is still 2.2.1 upstream. They do upgrade the toolchain (Vite 8, Vitest 4, ESLint 10, pnpm 11) and add **Swedish (`sv`)**, so there are 8 translation files. Specs and prototypes should target upstream `main`, not this branch's base.
- **Settled while charting (the destination's shape):**
  - **Two maps**, Budgeted and Outflow: side by side on wide screens, stacked on narrow ones (Budgeted first). Each master category has the same colour in both, and each map shows its total. Areas are not scaled to compare totals.
  - Categories nest inside master categories.
  - **Outflow** is net (money out minus refunds/inflows). Transfers and income are excluded, as are off-budget accounts, categories with nothing in the period, and categories whose net outflow is positive. (The earlier "include hidden categories" rule was dropped: Financier has none. See [the data-source ticket](issues/02-report-data-source.md).)
  - **Report periods** are whole months: This month, Last month (the default), Last 3 months, This year, Last year, Last 12 months. The last choice is remembered for the session.
  - **Interaction:** a tooltip with category, master category, amount, and share of the total. Clicking a master category zooms **both** maps into it. A breadcrumb plus a zoom-out button go back.
  - The menu entry is named "Spending by category" (reusing the commented-out placeholder). It replaces the branch's "Tree map" entry.

## Decisions so far

<!-- one line per closed ticket: [title](issues/NN-slug.md): gist -->

- [Research: tree map plugin for Chart.js 4](issues/01-treemap-plugin.md): use `chartjs-chart-treemap@4.2.2` (MIT, ~6.6 KB gzipped), pinned. Pass flat rows grouped by master category id and category id. Zoom has to be built in the app by re-rendering with filtered rows. Colours come from one shared master-category → colour map.
- [Grilling: where the report's numbers come from](issues/02-report-data-source.md): sum the budget's existing per-month Outflow and Budgeted per category, so the report matches the budget screen. Outflow with no current category becomes one "Uncategorised" block. Totals ≤ 0 are left out of both maps. The calculation is a tested service separate from the chart.
- [Prototype: layout and zoom](issues/03-layout-and-zoom-prototype.md): period tabs, a "← All categories" button, and two map cards that fill the screen height and stack below a 780px report width. Light colours with one dark text colour. Labels hide rather than shrink. Hovering highlights the whole master category. Zoomed maps regroup by category.
- [Grilling: starting point for the build](issues/04-build-starting-point.md): fresh branches from upstream `main`, not a rebase. The Chart.js 4 migration of the net worth chart goes up first as its own PR, and the feature PR opens only after it merges. The tree map copy is dropped, the toolchain matches upstream, and planning files stay on a fork-only branch.
- [Grilling: spec layout and build slices](issues/05-spec-and-build-slices.md): the spec stands alone and links tickets for the why. PR 1 has two slices (toolchain check, migration checked with screenshots). PR 2 has vertical slices: service → page shell → tree maps → zoom and hover. Each slice ships its keys in all 8 languages and ends with a manual checklist. [Spec written](spec.md).
- [Sync fork with upstream and check the toolchain](issues/06-sync-fork-and-toolchain.md): `main` fast-forwarded to upstream `299b120`. Node 26.12.1 (pinned in upstream CI and Dockerfile) via fnm, pnpm 11.8.0 via corepack 0.36.0. Install, lint, build and dev server clean; tests pass under `TZ=UTC` (2 pre-existing timezone-dependent failures east of UTC). Planning files live on `planning/spending-by-category`.

## Not yet specified

<!-- Nothing left in the fog. -->

**Destination reached (2026-11-07):** [spec.md](spec.md) is ready for `/to-tickets`. No open tickets remain.

## Out of scope

- Clicking a category to open its transactions: a possible follow-up.
- Custom from/to month ranges: a possible follow-up.
- A fallback if upstream declines Chart.js 4 (the tree map plugin needs it): that would redraw the destination as a new effort. See [Grilling: starting point for the build](issues/04-build-starting-point.md).
- Scaling map areas so the larger total looks larger: considered and ruled out to keep the report simple.
