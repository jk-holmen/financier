# 07: Migrate net worth chart to Chart.js 4 (PR 1)

**What to build:** The net worth report runs on Chart.js 4 and looks and behaves exactly as it did before. This becomes PR 1 upstream, "Migrate net worth chart to Chart.js 4". Branch `chartjs-4-net-worth` from the synced `main`. Cherry-pick `223832e` and `15d03ac`, and regenerate the lockfile with pnpm 11 instead of merging it by hand. Do not carry over the tree map copy (`9bfcc15`).

See spec sections 5 (Delivery) and 6 (slice S1). AFK build, HITL check.

**Blocked by:** 06 (Sync fork with upstream and check the toolchain)

**Status:** ready-for-agent

- [ ] Branch `chartjs-4-net-worth` contains the two cherry-picks and a lockfile regenerated with pnpm 11
- [ ] Tests and lint pass
- [ ] With the same budget, side-by-side screenshots of the net worth report on `main` and on the branch show the same bars, line, axes, tooltip text, colours and dark-mode look
- [ ] Bundle size change measured (before vs after)
- [ ] HITL: the user reviews the screenshots
- [ ] HITL: PR 1 opened upstream, with the before/after screenshots and the bundle size change in its description
