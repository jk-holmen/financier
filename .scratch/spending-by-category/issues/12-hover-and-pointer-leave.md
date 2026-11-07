# 12: Master-category hover and pointer-leave fix

**What to build:** Hover, tooltip and click always act on the same thing. Unzoomed, hovering anywhere on a master category darkens all its blocks and its caption band, shows the two-line tooltip (master category, then category, each with its amount and share of that map's total), and turns the cursor into a pointer. Zoomed, only the hovered category is highlighted. Chart.js's own per-block hover colour is off.

The pointer-leave fix is required. Track whether the pointer is inside each map with `mouseenter`/`mouseleave`, seeded from `canvas.matches(':hover')` after a redraw. Clear the highlight on leave, and ignore moves that arrive after leave. The prototype has a working version (spec section 4.4).

See spec sections 3.4 (hover shades), 3.5, 3.6 (slice S6). AFK build, HITL check.

**Blocked by:** 10 (Tree maps). Independent of 11; whichever of 11 and 12 lands second handles the zoomed hover case.

**Status:** ready-for-agent

- [ ] Hovering one block highlights its whole master category in that map
- [ ] Zoomed (if ticket 11 has landed), only the hovered category is highlighted
- [ ] A fast flick off the canvas never leaves a highlight stuck
- [ ] The cursor is a pointer over clickable areas
- [ ] Hovered blocks keep at least 6:1 contrast with the text colour
- [ ] Screenshots taken in the running app; tests and lint pass
