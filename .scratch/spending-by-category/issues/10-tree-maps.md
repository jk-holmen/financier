# 10: Tree maps

**What to build:** Each card draws its tree map. Blocks are categories, framed by master categories with caption bands, coloured from the shared colour map, with the same master category in the same colour in both maps and across periods. Category labels (name and amount, 13px, formatted with `intCurrency`) are hidden when they don't fit, never shrunk. The unzoomed tooltip shows the master category, the category, amounts and shares. Outflow on a deleted category appears as an Uncategorised block in its own group.

Add `chartjs-chart-treemap` pinned to exactly `4.2.2`, not `5.0.0-next.*`. The chart directive only draws: it registers the treemap controller and element, passes rows through `dataset.tree` (never `data`) with `key: 'amount'`, and groups by master category id and category id.

Labels in all 8 translation files: "Uncategorised", plus any tooltip wording.

See spec sections 3.4, 3.5, 4.2, 4.3 (slice S4). AFK build, HITL check.

**Blocked by:** 09 (Report page shell with period tabs, cards and totals)

**Status:** ready-for-agent

- [ ] The same master category has the same colour in both maps and across periods
- [ ] Small blocks hide labels rather than shrink them
- [ ] The tooltip shows the master category, category, amounts and shares
- [ ] An Uncategorised block appears for outflow on a deleted category
- [ ] Dark mode is legible
- [ ] Screenshots taken in the running app; tests and lint pass
