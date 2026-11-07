# 09: Report page shell with period tabs, cards and totals

**What to build:** A usable "Spending by category" report, apart from the maps. It's reachable from the reports menu (replacing the commented-out placeholder), with its own route and view transition. Period tabs default to "Last month", show the exact month range on hover, and the chosen tab is remembered in memory for the session across report switches. There are two cards, Budgeted then Outflow. Each shows its total; the Outflow card adds "· N% of budgeted". Both have their empty states. A container query on the report area stacks the cards below 780px. A placeholder sits where each map will go.

Labels in all 8 translation files (agent drafts the non-English text; the user checks `sv` and `no`): the report name, the 6 periods, the 2 map names, "of budgeted", and the empty-state texts.

See spec sections 3.1, 3.3, 3.8, 4.3 (slice S3). AFK build, HITL check.

**Blocked by:** 08 (Spending-by-category calculation service)

**Status:** ready-for-agent

- [ ] The menu item opens the report
- [ ] The tabs switch, and the choice survives switching to another report and back
- [ ] Each tab's tooltip shows its month range ("Last 3 months" does not include the current month)
- [ ] Totals match the budget screen's Outflow / Budgeted for one month and for "Last 3 months"
- [ ] Both empty states appear on an empty month
- [ ] At 779px vs 781px report width the cards stack / don't, with the sidebar open and closed
- [ ] No raw translation keys in any language
- [ ] Screenshots taken in the running app; tests and lint pass
