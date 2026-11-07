# 11: Zoom into a master category

**What to build:** Clicking a master category (or the Uncategorised block) zooms **both** maps into it, through zoom state that the controller shares between them. Zoomed maps show only that master category's rows, regrouped by category alone (no frame or caption). A "← All categories" button and a breadcrumb ("All categories › Housing") appear above the cards. Clicking inside a zoomed map does nothing. If a map has nothing in that master category, it shows the zoomed empty state. Changing the period keeps the zoom if the master category still has blocks in either map; otherwise it zooms out.

Labels in all 8 translation files: "All categories", plus the two zoomed empty-state messages.

See spec sections 3.3, 3.7, 3.8 (slice S5). AFK build, HITL check.

**Blocked by:** 10 (Tree maps)

**Status:** ready-for-agent

- [ ] Clicking zooms both maps
- [ ] Clicking while zoomed does nothing
- [ ] Zooming into a master category with outflow but nothing budgeted shows "Nothing budgeted in <master category>" in the Budgeted map
- [ ] Zooming out restores the previous view
- [ ] Changing the period keeps or drops the zoom per spec 3.7
- [ ] If ticket 12 has already landed: zoomed hover highlights only the hovered category
- [ ] Screenshots taken in the running app; tests and lint pass
