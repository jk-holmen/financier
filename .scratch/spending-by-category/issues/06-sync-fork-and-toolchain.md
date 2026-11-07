# 06: Sync fork with upstream and check the toolchain

**What to build:** A clean starting point that matches upstream. Add the `upstream` remote (`financier-io/financier`) and fast-forward the fork's `main` to upstream `main`. Set up upstream's Node version and pnpm 11 via corepack. Upstream has no Node version file, so work the version out from the toolchain's own engine requirements. Also put the planning files (`.scratch/`, `CONTEXT.md`, `AGENTS.md`) on the fork-only branch `planning/spending-by-category`, so they never end up in an upstream PR.

See spec sections 5 (Delivery) and 6 (slice S0).

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] `upstream` remote added; the fork's `main` is fast-forwarded to upstream `main` (no merge commit)
- [x] Node version chosen from upstream's toolchain engine requirements; pnpm 11 enabled via corepack
- [x] On clean `main`: `pnpm install`, the dev server, tests and lint all run cleanly with no local workarounds
- [x] Node and pnpm versions used are recorded in this ticket's answer
- [x] Planning files committed on `planning/spending-by-category` and not present on `main`
- [x] `add-expenditure-report` left untouched as a reference
- [x] Both `main` and `planning/spending-by-category` pushed to the fork (`origin`)

## Answer

Done 2026-11-07.

- **Remote:** `upstream` = `https://github.com/financier-io/financier.git`. The fork's `main` was fast-forwarded from `4ecd97c` to upstream `299b120` (1.11.1, 15 commits, no merge commit) and pushed to `origin`.
- **Node 26.12.1.** Upstream has no `.nvmrc`/`engines`, but its CI (`.github/workflows/build.yml`, `actions/setup-node` `node-version: "26.12.1"`) and `Dockerfile` (`FROM node:26.12.1`) both pin it. It satisfies every toolchain engine range in the lockfile: Vite 8.0.16 and rolldown `^20.19.0 || >=22.12.0`, ESLint 10.5.0 and jsdom 29.1.1 `^20.19.0 || ^22.13.0 || >=24`, Vitest 4.1.9 `^20 || ^22 || >=24`. (The machine's old Node 22.2.0 is below Vite 8's floor.) Installed per-user with fnm 1.39.0 (winget `Schniz.fnm`); a local, git-excluded `.node-version` selects it.
- **pnpm 11.8.0** via corepack, from `packageManager` in `package.json`. Node 25+ no longer bundles corepack, so `corepack@0.36.0` was installed globally into Node 26, as upstream's Dockerfile does, then `corepack enable`.
- **Results on clean `main`:** `pnpm install --frozen-lockfile` OK (the old pnpm 9 `node_modules` had to be deleted first). `pnpm lint` OK. `pnpm build` OK. `pnpm start` serves the app (Vite 8.0.16 ready in ~0.8 s).
- **Tests:** 313/315 pass in local time; all 315 pass with `TZ=UTC`, which is what CI uses. The two failures are pre-existing (the files are unchanged since `4ecd97c`) and timezone-dependent: `Transaction.spec.js` "date › zeroes out timezone" and "can be set from record" set local midnight and expect `toISOString()` to keep the same date, which fails east of UTC (Stockholm is UTC+1). Not fixed here; a possible small upstream fix. Run tests with `TZ=UTC` locally until then.
- **Local gotchas (not code issues):** vitest also collects specs from leftover agent worktrees under `.claude/worktrees/`, so run `pnpm test --dir src` or remove the worktree. `pnpm format` flags ~252 files only because `core.autocrlf=true` checks them out with CRLF; upstream CI doesn't run it.
- **Planning files** (`.scratch/`, `CONTEXT.md`, `AGENTS.md`, `docs/agents/`) are committed on `planning/spending-by-category` (branched from the synced `main`) and pushed to `origin`. `docs/agents/` is force-added because `docs/` is gitignored upstream. `add-expenditure-report` is untouched.
