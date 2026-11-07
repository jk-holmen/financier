# Prototype: layout and zoom

Type: prototype
Status: resolved
Blocked by: 01
Part of: [Spending by category](../map.md)

## Question

How should the two-map report look and behave? Build a rough prototype with the chosen plugin and fake data, then react to it:

- the breadcrumb and zoom-out button: where they sit, and how they read in both maps' shared header
- the colour palette when there are more master categories than colours, keeping the colours stable across both maps and across zoom
- labels on tiny blocks, and how the tooltip reads
- where the period picker and the two totals sit, at wide and narrow widths
- what an empty map looks like (e.g. no outflow yet this month, or nothing budgeted). The plugin draws nothing for an empty tree, so the app must draw the empty state.
- how the "Uncategorised" block (its own group, outside the master categories) is coloured and labelled
- when zoomed in, whether to keep the framed master-category caption or regroup by category alone so the categories fill the area

The plugin facts (no built-in zoom, label overflow modes, click returns both levels) are in the answer to [01](01-treemap-plugin.md).

## Answer

Settled over three prototype rounds with real and fake data (9 master categories, plus an empty state).

- **Layout** (round 1's "B"): **period tabs** (pill buttons) along the top. Below them, a **"← All categories" button** (shown only when zoomed in) and the breadcrumb ("All categories › Housing"). Then the two maps as **cards**, each with a header holding its name and total. The Outflow header adds "· N% of budgeted" **at the same text size** as the rest. Rejected: a single toolbar with a dropdown and a disabled "Zoom out" button (A), and a sidebar with a period list, totals and a legend that zooms (C).
- **Size:** the maps **fill the remaining screen height** (min 320px). They're side by side, and **stack when the report area (not the window) is narrower than 780px**, i.e. when each map would drop below ~380px. Use a container query, because the app sidebar makes window width misleading. When stacked, each map is 65vh tall. Rejected: square maps, a fixed 380px height, and stacking at 960px (too soon) or at a window width of 800px (too late, maps got skinny).
- **Colour:** **one text colour everywhere (#1a1a1a) on light colours.** Per-block dark/white text was legible but felt inconsistent, and dark colours with white text lost to light colours. The hues are darkened Tableau 10 (`#2f5f8a #b04a0c #3a7a32 #c0392b #24756f #7d6400 #7b4f8e #7a5640`) mixed with white: category blocks at 68%, master caption band at 50%. Uncategorised is `#666666` mixed the same way. Master categories past the 8th reuse a hue, lighter (82% / 62%). Telling Housing and Gifts apart was judged fine, since they're separate rectangles. Every block has ≥ 5.2:1 contrast with the text. Hue order follows the budget's master-category order, so colours are stable across both maps, periods and zoom levels.
- **Labels:** category name and amount, 13px. **Hidden when they don't fit (`overflow: 'hidden'`), never shrunk** (`'fit'` was rejected as hard to read). Captions show the master category name and total. The tooltip always shows the category (master category), amount, and share of that map's total.
- **Hover** (added after round 3): hover, tooltip and click always act on the **same thing**. Not zoomed: hovering anywhere on a master category darkens **all** its blocks and its caption band one shade (white mix 55% / 38%, or 70% / 50% for extra hues; dark text stays ≥ 6:1). The cursor becomes a pointer. The tooltip shows the master category as the title, then a line for the master category and a line for the category under the cursor, each with its amount and share. Zoomed in: only the hovered category is highlighted, and the tooltip shows just it. Chart.js's own per-block hover colour is turned off. Highlighting only the block under the cursor was rejected as misleading, because the click zooms into the whole master category. **Must carry into the build:** Chart.js doesn't always report a hover change when the pointer leaves the canvas, and it handles pointer moves a frame late. So track whether the pointer is inside each map with `mouseenter`/`mouseleave` (seeded from `canvas.matches(':hover')` after a redraw), clear the highlight on leave, and ignore late moves. Without this, a fast exit leaves the highlight stuck.
- **Zoom:** clicking a master category zooms **both** maps. Zoomed in, the map **regroups by category alone**, so its categories fill the whole area with no frame or caption. "← All categories" zooms out. Clicking inside a zoomed map does nothing.
- **Empty state:** inside the card, a "∅" with a message and a hint: "Nothing budgeted / Assign money on the budget screen to see it here." or "No outflow yet / Nothing has been spent in <period>."
- **Prototype (primary source):** branch `prototype/spending-by-category-layout`, commits `f3218c9` (rounds 1–3) and `fc392be` + `eed3500` (hover and its leave fix), file `src/scripts/directives/reports/spendingByCategoryPrototype.js` (round 3; rounds 1–2 are described in its header and above). It is throwaway: not merged anywhere.
- **Dev-environment facts found along the way:** on this fork's base, `pnpm install` fails because the GitHub dependency `angular-legacy-sortablejs#fix-sortablejs-import` no longer exists (upstream uses the published `0.6.2`). On Node 22.2, the dev server needs `NODE_OPTIONS=--experimental-require-module`, because `babel.config.js` is ESM (upstream has moved to Node 24/26).
