# Grilling: starting point for the build

Type: grilling
Status: resolved
Blocked by:
Part of: [Spending by category](../map.md)

## Question

What does the build start from, given that this fork is 15 commits behind upstream `financier-io/financier` `main` (see the map's "Upstream baseline" note)?

- **Rebase or start fresh:** rebase `add-expenditure-report` onto upstream `main`, or start a new branch from upstream `main` and carry over only what's worth keeping? `package.json` and the lockfile will conflict with upstream's toolchain upgrade (Vite 8, Vitest 4, ESLint 10, pnpm 11).
- **What to keep from the branch:**
  - the Chart.js 4.x migration of the net worth chart (`223832e`, plus the `15d03ac` cleanup), which is probably worth keeping
  - the tree map copy of the net worth chart (`9bfcc15`: `treeMap.js`, `treeMapChart.js`, its spec, the route, the `TREE_MAP` key), which the decisions so far mostly replace
  - the `viewTransition.scss` tweak
- **Chart.js 4 migration as its own PR?** Upstream is still on Chart.js 2.2.1, so moving to 4 touches the net worth chart, and possibly the heat map, for everyone. Should that land upstream first as a separate, independently reviewable PR, with "Spending by category" building on it?
- **Local toolchain:** does development move to upstream's Node and pnpm versions (they need a newer Node than this machine's 22.2), so the local workarounds in the [prototype ticket](03-layout-and-zoom-prototype.md)'s answer go away?

## Answer

Settled in one grilling session (2026-11-06).

- **Two upstream PRs, in order.** First "Migrate net worth chart to Chart.js 4" on its own, then "Spending by category" on top of it. The heat map doesn't use Chart.js, so the migration only touches the net worth chart (the `223832e` + `15d03ac` changes).
- **Start fresh, don't rebase.**
  1. Add an `upstream` remote (`financier-io/financier`) and fast-forward the fork's `main` to upstream `main`.
  2. Create branch `chartjs-4-net-worth` from it, cherry-pick `223832e` + `15d03ac`, and regenerate `pnpm-lock.yaml` with pnpm 11 instead of resolving the conflict by hand.
  3. Create branch `spending-by-category` from `chartjs-4-net-worth`.
  4. Keep `add-expenditure-report` as a reference; retire it without deleting it.
- **Drop the tree map copy (`9bfcc15`) entirely.** The build recreates the route, menu entry, translation key and `viewTransition.scss` entry under "spending by category" names.
- **Toolchain matches upstream.** Use upstream's Node and pnpm 11 (via corepack). The first step on the fresh branch is checking that `pnpm install`, the dev server and the tests run cleanly with no local workarounds. That retires the sortablejs and `--experimental-require-module` workarounds noted in [Prototype: layout and zoom](03-layout-and-zoom-prototype.md). Upstream has no Node version file, so work out the version from the toolchain's own requirements.
- **Planning files stay out of upstream PRs.** `.scratch/`, `CONTEXT.md` and `AGENTS.md` get committed only on a fork-only branch, `planning/spending-by-category`.
- **PR timing.** Work on the stacked feature branch locally, but open the feature PR upstream only after the Chart.js 4 PR is merged, so reviewers never see the two diffs mixed together.
- **If upstream declines Chart.js 4**, the destination gets redrawn as a new effort. No fallback is planned (see the map's Out of scope section).
