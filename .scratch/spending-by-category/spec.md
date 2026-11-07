# Spec: Spending by category

Status: ready-for-agent
Map: [Spending by category](map.md)

## 1. Summary

A new report, **"Spending by category"**, answers the upstream project's long-standing request (the commented-out `Spending by Category` placeholder in `src/views/reports.html`). For a chosen **report period** it shows two nested tree maps, **Budgeted** and **Outflow**, where blocks are categories and frames are master categories. Clicking a master category zooms both maps into it.

The work goes upstream to `financier-io/financier` as two PRs: first a Chart.js 4 migration of the net worth chart, then the report itself.

## 2. Vocabulary

Use the terms in [`CONTEXT.md`](../../CONTEXT.md): master category, category, Budgeted, Outflow, budget month, uncategorised outflow, report period. In code and UI copy, don't say "spending" for Outflow, except in the report's own name.

## 3. Behaviour

### 3.1 Report periods

*Why:* [map Notes](map.md#notes).

- Tabs (pill buttons): **This month**, **Last month** (default), **Last 3 months**, **This year**, **Last year**, **Last 12 months**. All are whole budget months. "Last 3 / 12 months" are the full months *before* the current one (on 7 Nov 2026: Aug–Oct 2026 and Nov 2025–Oct 2026). "This year" runs from January to the current month, inclusive.
- Hovering a tab shows a tooltip with the exact months it covers, e.g. "Aug 2026 – Oct 2026", or just "Oct 2026" for a single month. It uses the app's existing month formatting for the current language, so there's no per-tab sentence to translate.
- The chosen tab is remembered for the session (in memory, across report switches; not stored).
- "This month" is labelled plainly, not "so far". Future-dated transactions in the period count, as on the budget screen.

### 3.2 Data rules

*Why:* [Grilling: where the report's numbers come from](issues/02-report-data-source.md).

- **Outflow** per category = the sum of each budget month's `categoryCache[id].outflow` over the period. **Budgeted** = the sum of `categories[id].budget`. Use the budget's existing month list. **Never call `MonthManager.getMonth`**, which creates months as a side effect. A month in the period that doesn't exist counts as zero.
- This inherits the budget screen's handling of splits, income (`incomeNextMonth` shifts a month) and off-budget accounts. The report matches the budget screen by construction.
- Outflow is stored negative; flip the sign so spending is a positive amount. A category whose summed total is **≤ 0** is left out of that map. The same rule applies to Budgeted.
- Outflow whose category is missing or deleted is **uncategorised outflow**. It's summed into **one "Uncategorised" block** in its own group, outside every master category. Budgeted has no such block.
- Master-category membership and names come from the budget's current categories.
- Each map's **total** is the sum of its shown blocks.

### 3.3 Layout

*Why:* [Prototype: layout and zoom](issues/03-layout-and-zoom-prototype.md).

- From top to bottom: period tabs; then, only while zoomed, the **"← All categories"** button and the breadcrumb ("All categories › Housing"); then two **cards**.
- Each card header shows the map name and total. The Outflow header adds "· N% of budgeted" at the same text size, rounded to whole percent, and omitted when the Budgeted total is 0.
- The maps fill the remaining screen height (min 320px). They sit side by side and **stack when the report area is narrower than 780px**, measured with a **container query** on the report area, not the window. Budgeted goes first. Stacked, each map is 65vh tall.
- Map areas are not scaled relative to each other.

### 3.4 Colour

*Why:* [Prototype: layout and zoom](issues/03-layout-and-zoom-prototype.md).

- One text colour everywhere: `#1a1a1a`.
- Base hues (darkened Tableau 10), assigned in the budget's master-category order. Colours stay the same across both maps, all periods, and zoom: `#2f5f8a #b04a0c #3a7a32 #c0392b #24756f #7d6400 #7b4f8e #7a5640`.
- Mix each hue with white. Category blocks are 68% white and the master caption band is 50%. Master categories past the 8th reuse hues in order, lighter: 82% / 62%. Uncategorised uses `#666666`, mixed the same way.
- Hover shade: 55% / 38% (70% / 50% for the reused hues).
- Every block keeps at least 5.2:1 contrast with the text colour, or 6:1 when hovered. The colour maths is in the prototype file (see 4.4).

### 3.5 Labels and tooltip

- Category blocks show the category name and amount in 13px text, **hidden when they don't fit** (`labels.overflow: 'hidden'`), never shrunk.
- Master-category captions show the name and total. The plugin hides them when the box is too short.
- Amounts are formatted with the existing `intCurrency` filter.
- Tooltip, not zoomed: the master category is the title, then one line for the master category and one for the category under the cursor, each with amount and share of **that map's** total. Zoomed: only the category, with amount and share.

### 3.6 Hover

*Why:* [Prototype: layout and zoom](issues/03-layout-and-zoom-prototype.md).

- Hover, tooltip and click always act on the same thing. Not zoomed: hovering anywhere on a master category darkens **all** its blocks and its caption band, and the cursor becomes a pointer. Zoomed: only the hovered category is highlighted. Chart.js's own per-block hover colour is turned off.
- **Pointer-leave fix (required):** Chart.js doesn't always report the pointer leaving the canvas, and it handles moves a frame late. Track whether the pointer is inside each map with `mouseenter`/`mouseleave`, seeded from `canvas.matches(':hover')` after a redraw. Clear the highlight on leave, and ignore moves that arrive after leave. Otherwise a fast exit leaves the highlight stuck.

### 3.7 Zoom

- Clicking a master category (or the Uncategorised block) zooms **both** maps into it. Shared zoom state drives both charts.
- Zoomed in, a map shows only that master category's rows, **regrouped by category alone** (no frame or caption), so the categories fill the whole area.
- "← All categories" zooms out. Clicking inside a zoomed map does nothing.
- A master category can have blocks in one map but not the other (e.g. outflow in Housing but nothing budgeted to it). Zooming into it then leaves the other map empty, and that map shows the zoomed empty state (3.8).
- Changing the period keeps the zoom if the master category still has blocks in either map; otherwise it zooms out.

### 3.8 Empty states

The plugin draws nothing for an empty tree, so the card draws its own empty state: "∅", a message, and a hint.

- Budgeted: "Nothing budgeted" / "Assign money on the budget screen to see it here."
- Outflow: "No outflow yet" / "Nothing has been spent in <period>."
- Zoomed, with nothing in that master category: "Nothing budgeted in <master category>" or "No outflow in <master category>", with no hint. The breadcrumb and "← All categories" still apply to both maps.

### 3.9 Out of scope

Copied from the [map](map.md#out-of-scope): clicking a category to open its transactions; custom from/to month ranges; a fallback if upstream declines Chart.js 4; scaling areas to compare totals.

## 4. Code shape

*Why:* [Research: tree map plugin](issues/01-treemap-plugin.md), [Grilling: where the report's numbers come from](issues/02-report-data-source.md).

### 4.1 Calculation service

`src/scripts/services/reports/spendingByCategory.js` with `spendingByCategory.spec.js`, in the style of `netWorth.js` / `netWorth.spec.js`. Pure functions, no Angular, no DOM:

- **Period → budget months:** `(periodId, today) → month keys`. The first and last keys also feed the tab tooltip.
- **Rows:** `(months, categories, masterCategories, monthKeys) → { budgeted: Row[], outflow: Row[] }`, where `Row = { masterCategoryId, masterCategoryName, categoryId, categoryName, amount }`. `amount` is a positive integer in the smallest currency unit, and rows are ordered by the budget's master-category and category order. The Uncategorised row uses a reserved id for both master category and category, and its name is a translation key.
- **Colour map:** `(masterCategories) → Map<masterCategoryId, { block, caption, blockHover, captionHover }>`, plus the Uncategorised entry.
- **Zoom filter:** `(rows, masterCategoryId) → rows` for that master category.
- **Share:** `(amount, total) → percent`, and the "N% of budgeted" figure.

### 4.2 Chart directive

`src/scripts/directives/reports/spendingByCategoryChart.js`. It only draws. Inputs: rows, colour map, the zoom state (shared with the other map through the controller), and an empty-state message. It registers `TreemapController` and `TreemapElement` with `Chart.register(...)`, passes rows via `dataset.tree` (never `data`), with `key: 'amount'` and `groups: ['masterCategoryId', 'categoryId']` (or `['categoryId']` when zoomed). Zooming sets a new `tree` array and calls `chart.update()`. On click, pick the element with `raw.l === 0` to get the master category.

### 4.3 Wiring

- Dependency: `chartjs-chart-treemap` pinned to exactly `4.2.2` (MIT, about 6.6 KB gzipped). Not `5.0.0-next.*`.
- State `user.app.manager.view.reports.spendingByCategory`, URL `/spending-by-category`, with `onEnter` setting `$rootScope.lastOpenedReport = "spendingByCategory"`, as the net worth state does.
- View `src/views/reports/spendingByCategory.html`, with a controller in `src/scripts/controllers/reports/` (like `heatMapCtrl.js`) that holds the period, zoom state, rows and totals.
- Menu: replace the commented-out placeholder in `src/views/reports.html` with an item labelled `SPENDING_BY_CATEGORY`.
- Add `"spendingByCategory"` to `$reports` in `src/styles/viewTransition.scss`.
- Styles for the tabs, cards, and the container query in the reports SCSS.
- Translation keys in all 8 files under `src/assets/translations/` (`ca de en es fr no ru sv`).

### 4.4 References

- Prototype (throwaway, not to be merged): branch `prototype/spending-by-category-layout`, file `src/scripts/directives/reports/spendingByCategoryPrototype.js` (commits `f3218c9`, `fc392be`, `eed3500`). Use it for the colour maths, hover and pointer-leave handling.
- Plugin research: branch `research/treemap-plugin`, file `research/chartjs-treemap-plugin.md`.

## 5. Delivery

*Why:* [Grilling: starting point for the build](issues/04-build-starting-point.md), [Grilling: spec layout and build slices](issues/05-spec-and-build-slices.md).

- Target upstream `main`, not this fork's old base. Use upstream's Node and pnpm 11 (corepack), with no local workarounds.
- Branches: the fork's `main` fast-forwarded to upstream → `chartjs-4-net-worth` → `spending-by-category`, stacked on it. `add-expenditure-report` is kept as a reference and not built on. The tree map copy (`9bfcc15`) is not carried over.
- **PR 1, "Migrate net worth chart to Chart.js 4":** opened upstream when ready. Its description includes the before/after screenshots and the bundle size change.
- **PR 2, "Spending by category":** built locally on top of PR 1, and **opened only after PR 1 is merged**. Its description lists which translations are machine-drafted and asks for native review.
- Planning files (`.scratch/`, `CONTEXT.md`, `AGENTS.md`) stay on the fork-only branch `planning/spending-by-category` and never go into an upstream PR.

## 6. Slices

Each slice can be built and reviewed on its own and ends usable. Every slice that adds a label adds it in **all 8 translation files**; the agent drafts the non-English text, and the user checks `sv` and `no`. Every UI slice ends with its manual checklist, checked in the running app with screenshots.

### PR 1: Migrate net worth chart to Chart.js 4

**S0. Sync fork and check upstream toolchain**: AFK. Blocked by: nothing.
Add the `upstream` remote, fast-forward the fork's `main`, and set up upstream's Node (worked out from the toolchain's own engine requirements, since upstream has no version file) and pnpm 11 via corepack.
*Done when:* on clean `main`, `pnpm install`, the dev server, tests and lint all run cleanly with no workarounds, and the Node version used is recorded in the slice's answer.

**S1. Migrate net worth chart**: AFK build, HITL check. Blocked by: S0.
Branch `chartjs-4-net-worth`. Cherry-pick `223832e` and `15d03ac`, and regenerate `pnpm-lock.yaml` with pnpm 11 instead of merging it by hand.
*Done when:* tests and lint pass; with the same budget, side-by-side screenshots of the net worth report on `main` and on the branch show the same bars, line, axes, tooltip text, colours and dark-mode look; the bundle size change is measured. PR 1 opened.

### PR 2: Spending by category

**S2. Calculation service**: AFK. Blocked by: S1 (for the branch).
Branch `spending-by-category`. Build everything in 4.1, test-first.
*Done when:* unit tests cover:
- each period's months, including year boundaries
- summing across months
- missing months
- the sign flip
- ≤ 0 exclusion in both maps
- refunds netting out
- uncategorised and deleted-category outflow merged into one block
- row order
- colour map stability and hue reuse past 8
- the zoom filter
- share rounding

**S3. Page shell**: AFK build, HITL check. Blocked by: S2.
The state, view, controller, menu item, view transition, period tabs (default "Last month", remembered for the session), both cards with totals and "· N% of budgeted", empty states, the stacking container query, and a placeholder where each map goes. Labels: the report name, the 6 periods, the 2 map names, "of budgeted", and the empty-state texts.
*Checklist:*
- the menu item opens the report
- the tabs switch and the choice survives switching reports and back
- each tab's tooltip shows its month range ("Last 3 months" does not include the current month)
- totals match the budget screen's Outflow / Budgeted for one month and for "Last 3 months"
- both empty states appear on an empty month
- 779px vs 781px report width stacks / doesn't, with the sidebar open and closed
- no raw translation keys in any language

**S4. Tree maps**: AFK build, HITL check. Blocked by: S3.
Add the dependency, the directive (4.2), colours, labels, captions, and the unzoomed tooltip. Labels: "Uncategorised", plus any tooltip wording.
*Checklist:*
- the same master category has the same colour in both maps and across periods
- small blocks hide labels rather than shrink them
- the tooltip shows the master category, category, amounts and shares
- an Uncategorised block appears for outflow on a deleted category
- dark mode is legible

**S5. Zoom**: AFK build, HITL check. Blocked by: S4.
Implement 3.7: both maps zoom, the regrouped view, the "← All categories" button, the breadcrumb, the zoomed empty states, and the period-change rule. Labels: "All categories", plus the two zoomed empty-state messages.
*Checklist:*
- clicking zooms both maps
- clicking while zoomed does nothing
- zooming into a master category with outflow but nothing budgeted shows "Nothing budgeted in <master category>" in the Budgeted map
- zooming out restores the previous view
- changing the period keeps or drops the zoom per 3.7

**S6. Hover**: AFK build, HITL check. Blocked by: S4 (independent of S5; whichever lands second handles the zoomed hover case).
Implement 3.6 and the two-line tooltip.
*Checklist:*
- hovering one block highlights its whole master category in that map
- zoomed, only the hovered category is highlighted
- a fast flick off the canvas never leaves a highlight stuck
- the cursor is a pointer over clickable areas

After S5 and S6: PR 2 is ready, but stays unopened until PR 1 is merged.
