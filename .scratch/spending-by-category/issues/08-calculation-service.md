# 08: Spending-by-category calculation service

**What to build:** The pure calculation behind the report, written test-first, in the style of the net worth report's service and its spec. No Angular, no DOM. It turns a report period and the budget's existing months into Budgeted and Outflow rows per category, plus the shared colour map, the zoom filter and share percentages. Its numbers match the budget screen by construction.

Branch `spending-by-category`, stacked on `chartjs-4-net-worth`. See spec sections 3.1, 3.2, 3.4 and 4.1 (slice S2). The colour maths is in the prototype (spec section 4.4).

Key rules from the spec:

- Period → budget month keys, `(periodId, today)`. "Last 3 / 12 months" exclude the current month; "This year" is January through the current month.
- Sum `categoryCache[id].outflow` (sign flipped) and `categories[id].budget` over the budget's **existing** months. Never call `MonthManager.getMonth`. A missing month counts as zero.
- Totals ≤ 0 are left out of each map. Outflow on a missing or deleted category merges into one Uncategorised row with a reserved id and a translation-key name.
- Rows follow the budget's master-category and category order. Colours are assigned in master-category order, with hues reused (lighter) past the 8th.

**Blocked by:** 07 (Migrate net worth chart to Chart.js 4; for the branch only)

**Status:** ready-for-agent

- [ ] Unit tests for each period's months, including year boundaries
- [ ] Unit tests for summing across months and for missing months
- [ ] Unit tests for the sign flip, ≤ 0 exclusion in both maps, and refunds netting out
- [ ] Unit tests for uncategorised and deleted-category outflow merged into one block
- [ ] Unit tests for row order
- [ ] Unit tests for colour map stability and hue reuse past 8
- [ ] Unit tests for the zoom filter and share rounding (including "N% of budgeted", omitted when Budgeted is 0)
- [ ] Tests and lint pass
