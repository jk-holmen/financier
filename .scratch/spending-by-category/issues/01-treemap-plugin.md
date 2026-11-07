# Research: tree map plugin for Chart.js 4

Type: research
Status: resolved
Blocked by:
Part of: [Spending by category](../map.md)

## Question

Which tree map plugin should the "Spending by category" report use with the app's Chart.js 4.4.9? `chartjs-chart-treemap` is the likely candidate. Establish:

- whether it is compatible with Chart.js 4.4.9 (version range, ESM import and registration alongside the existing `Chart.register(...)` usage)
- whether it supports two-level **nested groups** (master category → category) and how the data must be shaped
- the **click/hover events** it provides: can a click identify the master category (for zoom) and can tooltips show category, master category, amount, and share?
- how it renders **labels on small blocks** (fitting, hiding, overflow)
- whether it can **zoom** into a group, or whether zoom means re-rendering with filtered data
- colouring per group (needed so a master category has the same colour across two charts)
- licence, bundle size, maintenance status, and how likely the original project is to accept it as a dependency
- alternatives (another plugin, or drawing it ourselves) if it falls short

## Answer

- **Plugin:** use `chartjs-chart-treemap@4.2.2`, pinned exactly. It is the `latest` stable release, dated 2026-09-06. Its peer dependency is `chart.js >=3.0.0`, so Chart.js 4.4.9 is in range. It ships an ESM build, and you register it with `Chart.register(TreemapController, TreemapElement)` next to `Tooltip`. Don't use `5.0.0-next.*`, which is a prerelease that replaces `tree` with `data`.
- **Data shape:** pass flat rows `{ masterCategoryId, masterCategoryName, categoryId, categoryName, amount }` (`amount` > 0) as `tree`, with `key: 'amount'` and `groups: ['masterCategoryId', 'categoryId']`. Group by **id**, because rows with the same group value are merged. Map ids to names in the `captions` and `labels` formatters. Each rectangle's `raw` has `l` (0 = master category, 1 = category), `g` (the id), `v` (the amount) and `_data.children` (the original rows).
- **Click and tooltip:** use the standard `options.onClick(e, elements)`. A point returns both the master-category and category elements, so pick the one with `raw.l === 0` to get the master category to zoom into. Tooltip callbacks read the names from `raw._data.children[0]` and the amount from `raw.v`. The share is `raw.v / total`, where `total` is computed by the directive.
- **Zoom:** there is no built-in zoom. Re-render instead: set `dataset.tree` to the clicked master category's rows (a new array) and call `chart.update()`. The same shared zoom state drives both charts.
- **Colour:** `backgroundColor` is scriptable with `ctx.raw`. Build one `masterCategoryId → colour` map from the budget's full sorted master-category list, and share it between both charts and every zoom level. Category blocks can get a tint chosen by `raw.l`.
- **Labels:** category labels are off by default. Turn them on and use `labels.overflow: 'hidden'` to skip text that doesn't fit; the other options are `'fit'`, which shrinks the font, and `'cut'`, which clips. Master-category captions hide themselves when the box is shorter than one line. 4.x has no ellipsis or wrap.
- **Licence and size:** MIT, by Jukka Kurkela (kurkle), the second-largest Chart.js contributor. The plugin is listed in `chartjs/awesome`. The minified build is 16 KB (about 6.6 KB gzipped), with zero dependencies. The repo is active (last push 2026-10-26).
- **Alternative:** `d3-hierarchy` (ISC, about 5.8 KB gzipped) only computes the layout. Drawing, hit-testing, tooltips and labels would all be custom code. Rejected.
- **Caveats:** in 4.x the plugin overwrites `dataset.data`, so always pass rows via `tree`. An empty tree draws nothing, so the app has to draw the empty state. `main` is still on `chart.js` 2.2.1; only `add-expenditure-report` has 4.4.9, so the upstream PR includes that migration.
- Full findings: branch `research/treemap-plugin`, file `research/chartjs-treemap-plugin.md`
