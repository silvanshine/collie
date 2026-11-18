# Personal Collie fork

This independent maintenance repository carries local fixes over
[AltanS/collie](https://github.com/AltanS/collie). The original project is read-only: no pushes,
pull requests, issues, releases, or workflow actions there. Personal repositories are independent
repositories, outside the original project's fork network.

## Sync contract

- **Maintained bookmark:** `custom`.
- **Upstream ref:** `main@upstream`; local `main` is a patch-free upstream mirror.
- **Maintained base:** upstream `v1.25.5`, commit `5c45b3df6d9e7b1c7efd9ea4ddc1376c6a73f198`,
  since the 2026-11-03 sync. Earlier bases were `v1.25.3` (`9eeedd89`, 2026-11-01), `v1.24.0`
  (`4bab157e`, 2026-10-26) and the initial `v1.18.1`, commit
  `cfaf95a93df3c9404a03f5f840bf222f0cd6c2ee`.
- **Personal remotes:** Forgejo `origin` and GitHub `github`, both owned by `silvanshine`.
- **Upstream remote:** anonymous HTTPS, with `/dev/null` as its only push URL.
- **Snapshot policy:** `snapshot.auto-track = "none()"`; track intentional new files explicitly.
- **Narrow validation:** `bun test bridge/fork-release-check.test.ts bridge/update.test.ts
  bridge/version.test.ts cli/doctor.test.ts`, web
  `vitest run src/lib/build.test.ts`, both root and web typechecks, full lint.
- **Broad validation:** root `bun run test`, web `bun run test`, `bun run test:crew`, and full
  `bun run build`. Record environment-related limitations separately from verified checks.
- **Consumer edges:** Fedora's bridge runs this fork from the jj workspace
  `~/projects/forks/collie-deploy` since 2026-10-27, built with `scripts/collie-ctl.sh build`.
  Never run `collie update` there: on a source checkout it moves to the newest upstream tag with
  Git, dropping the fork commits. Move the workspace onto `custom` and build again instead.
  Since `fork/2026.11.2` the bridge does not check upstream releases at all, so the phone never
  offers that update. A new upstream release reaches the bridge only through a fork sync.
- **Runtime extensions:** none added by the fork.
- **Build identity:** the upstream manifest version plus the fork commit, in Collie's existing
  build stamp (`1.25.5-dev+<commit>`). Build from a clean jj child so Git's `HEAD` names the
  commit rather than its parent. A build at a `fork/YYYY.M.N` tag also records the tag in the
  stamp's `fork` field, which `collie version` prints in parentheses and the PWA footer shows after
  the commit. The crew wire version, the stamp's `id` and the release/dev channel do not change.

## fork/2026.11.3 (2026-11-18)

Fourth snapshot, on upstream `v1.25.5` (`5c45b3df`). Its tree differs from the checked feature
commit `e7f1fd779d25` only in this ledger, so the checks below apply to it.

### Fork modifications

- Name the fork snapshot in the build stamp (unchanged).
- Ignore local Pluram capture state (unchanged).
- The bridge never checks upstream releases (unchanged).
- **New:** an input profile for Interlace, the fork owner's agent TUI
  (`web/src/lib/surface/profiles/interlace.json`). Herdr reports its panes as `interlace`; without
  a profile a walky talky message was typed blind. The box has blank edges: the notice row over the
  `>` prompt is the top edge while it is blank, and the state row is the bottom edge while it says
  `idle` or `working`. A notice, an approval's question, or a picker's or the search's query leaves
  no frame, so nothing is typed; nothing is typed in the steer mode either. Enter in a turn queues.
  Seventeen screens of Interlace 2026.11.2 back it (`web/src/fixtures/panes/interlace--*.txt`).
  The range and the probe stay provisional in the profile.
- **New:** the profile field `reservedLastWordLeads` (`web/src/lib/surface/profile.ts`,
  `bridge/surface/protocol.ts`). A text whose last word starts with a listed lead is refused
  `reserved_lead` before any key, in every writing mode. Interlace lists `@`: a typed word that
  starts with it opens the file list, and Enter then takes the list's selection. A leading `@` is
  not reserved, because the list closes when the cursor leaves the word. Where the multiplexer
  pastes the text no list opens. An Add is read again with the proven draft it joins: typed, it is
  refused when the draft and the text together end in such a word; pasted, only when the text is
  one line and the draft's own last word starts with the lead too. No other profile sets the field.
- **New:** the profile field `idle.frame.maxDraftShare` (`web/src/lib/surface/profile.ts`,
  `web/src/lib/surface/frame.ts`, `web/src/lib/surface/fold.ts`): the tallest draft as a whole
  percentage of the rows read. The walk up a box crosses that share of the rows, or `maxDraftRows`
  when that is more. Interlace sets 30, its input's own limit. No other profile sets the field.
- `interlace` joins the profile-only agent names (`bridge/mux/agents.ts`) and the names the New
  sheet does not start (`bridge/harness-launch.ts`); the doctor's golden gains its sends row.

Known limits, recorded from the review:

- The screen read drops a space at a draft's end, so an Add is refused when the draft's last word
  starts with `@` and the text does not clearly leave it, even where the list had closed.
- A message that itself holds marker-shaped text (`[paste #1 +12 lines]`) shares the engine's
  collapse path, as on every profile with a collapse pattern.

Checks on the feature commit:
- Narrow: `bun test bridge/surface` passed 1431, web `vitest run src/lib/surface` passed 3635,
  both typechecks passed, and lint exited 0.
- Broad: `scripts/collie-ctl.sh build` passed in the deploy workspace. Root `bun test ./bridge`
  passed 9623 and failed 2 timing tests (`launchers-durable.test.ts`, `stt/local-cli.test.ts`)
  under a load average near 85 from another build; both files pass alone (57/57). `./cli`,
  `./scripts` and `./herdr-app-mod` passed (2776, 722, 21). The shell scripts were run one by one:
  all exit 0 except `scripts/collie-cli.test.sh`, which fails the known "bun not found" assertion
  that plain `v1.25.5` fails here too. Web `bun run test` passed 52,110 and failed 1
  (`router.test.tsx`), which passes alone (3/3). `bun run test:crew` was not run: the fork does
  not touch the crew harness.
- Live: the bridge at `1.25.5-dev+e7f1fd779d` typed three walky talky messages into an Interlace
  2026.11.2 pane on Herdr, one at an idle box and two queued in a turn, and each was read there.
  A fourth, sent while a notice stood on the notice row, was not typed and waits in the inbox.
  The `@` refusal was not exercised live: an agent's message is typed as its header line.
- Review: GPT-6.2 Sol, nine rounds on the feature commit. The last found no new defect and still
  said FIX for the two known limits above, which are declined.

## fork/2026.11.2 (2026-11-03)

Third snapshot, on upstream `v1.25.5` (`5c45b3df`). Its tree differs from the checked sync tip
`37e0143e` only in this ledger, so the checks below apply to it.

### Fork modifications

- Name the fork snapshot in the build stamp (unchanged).
- Ignore local Pluram capture state (unchanged).
- **New:** the bridge never checks upstream releases. `bridge/index.ts` builds its release reads
  with `forkReleaseFetchers()` (`bridge/update.ts`) instead of `releaseFetchers`, so the tag fetch
  fails at once with a fork reason and nothing asks GitHub. With no `latest` there is no "Collie
  update available" push, no "available" band and no update offer on the phone, whatever the
  `updates` notify pref says. A manual "check for updates" reports a failed check, never "Up to
  date". The boot log says the check is off. Left alone: `collie update --check`, `doctor`, the
  restart-needed band and the PWA bundle self-updater. `bridge/fork-release-check.test.ts` covers
  it.

### Sync onto v1.25.5 (2026-11-03)

The maintained line was duplicated from base `v1.25.3` (`9eeedd89`) onto exact upstream `v1.25.5`
(`5c45b3df`), the newest tag older than 24 hours (`v1.25.6` was tagged that day;
`v1.26.0-edge.1` is a prerelease). `main@upstream` was `169fecfe`. The old tip `04773c7b`
(`fork/2026.11.1`) is kept as `archive/pre-sync/2026.11.2`.

| Old | New | Disposition |
| --- | --- | --- |
| `936839ec` | `2d4e0955` | Identical (empty: the checkout's initialization). |
| `6ea53d5f` | `d38aff87` | Identical. |
| `42353920` | `587c8877` | Identical. |
| `bbbb6963` | `9f3e64d6` | Identical (ledger). |
| `f07cf758` | `5a5e671f` | Identical. |
| `71f91807` | `7fbcbe26` | Identical (ledger). |
| `c489644d` | `3b409b37` | Identical (ledger). |
| `04773c7b` | `bd2f5396` | Identical (ledger). |

`git range-diff` marks all eight `=`, none conflicted, and the duplicated `FORK_CHANGELOG.md` was
byte-identical to the old tip's before this entry.

Checks on the new tip:
- Narrow: the four bun files passed 330/330, web `src/lib/build.test.ts` passed 11/11, both
  typechecks passed, and lint exited 0.
- Negative control: with `forkReleaseFetchers` answering a tag and `index.ts` back on
  `releaseFetchers`, all three fork tests fail (0 pass, 3 fail).
- Broad: `bun run build` passed. Root `bun run test` passed all 13,136 bun tests, then stopped at
  the known `scripts/collie-ctl.test.sh` assertion ("bun not found"), which exits 0 run directly.
  The scripts after it in the chain were run one by one: all exit 0 except
  `scripts/collie-cli.test.sh`, which fails the same "bun not found" assertion on plain `v1.25.5`
  in a control workspace. Web `bun run test` passed 51,860 and failed 2 (`app.test.tsx` in the
  playground and `wide-layout.test.tsx`), both of which pass alone (62/62). `bun run test:crew`
  passed 82/82 in 4 of 6 runs; each other run failed one TLS-pool timing test in "a cold
  handshake priced above the budget". Plain `v1.25.5` failed the same group's "ABORTED
  handshake" test in 1 of 5 runs, so this is an upstream flake. The fork does not touch the crew
  harness or the web app.
- Review: GPT-6.1 Sol, SHIP, on the feature commit.

## fork/2026.11.1 (2026-11-01)

Second snapshot, on upstream `v1.25.3` (`9eeedd89`). Its tree differs from the checked sync tip
`c489644d` only in this ledger, so the checks below apply to it.

### Fork modifications

- Name the fork snapshot in the build stamp (unchanged from `fork/2026.10.1`).
- Ignore local Pluram capture state (unchanged).
- **Dropped:** the doctor forwarded-peer diagnostic. Upstream `76b3eb5b` ("bind row accepts a
  loopback peer the lead has dialled", first in `v1.25.0`) accepts a loopback peer once its runtime
  marker records `leadLastDialledAt`. That is looser than the fork's check, which also required a
  fresh checkpoint from this boot, a matching roster and no later secret refusal. The looser check
  was kept by decision on 2026-11-01, so the fork no longer touches `cli/doctor.ts`.

### Sync onto v1.25.3 (2026-11-01)

The maintained line was duplicated from base `v1.24.0` (`4bab157e`) onto exact upstream
`v1.25.3` (`9eeedd89`), the newest tag older than 24 hours. The old tip `1d44c28f`
(`fork/2026.10.1`) is kept as `archive/pre-sync/2026.11.1`.

| Old | New | Disposition |
| --- | --- | --- |
| `445d1eb1` | `936839ec` | Identical (empty: the checkout's initialization). |
| `8bbe31e8` | `6ea53d5f` | Reduced to the `AGENTS.md` pointer and the initial ledger; the `cli/doctor.ts`, `cli/doctor.test.ts`, `docs/crew.md` and `CHANGELOG.md` hunks were dropped as absorbed upstream. |
| `e672084e` | `42353920` | Identical. |
| `2f4ab403` | `bbbb6963` | Identical (ledger). |
| `7504fde3` | `f07cf758` | Ported. `bridge/version.test.ts` conflicted with upstream's new `sameBuild` import and tests; both kept. The operator-only suffix does not reach either: `sameBuild` callers pass `collieVersionBare`, and `answersThisBuild` gets `/api/health`'s bare `crewVersion` or the runtime marker's stamp `id`. The suffixed `bootVersion` and `liveVersion` are compared only with each other. |
| `1d44c28f` | `71f91807` | Identical (ledger). |

Checks on the new tip:
- Narrow: `bridge/version.test.ts` and `cli/doctor.test.ts` passed 210/210, web
  `src/lib/build.test.ts` passed 11/11, both typechecks passed, and lint exited 0.
- Negative control: with the `(fork/…)` suffix removed from `collieVersionFrom`, exactly the
  snapshot test fails (5 pass, 1 fail).
- Broad: `bun run test:crew` (82/82) and `bun run build` passed. Root `bun run test` passed all
  13,066 bun tests and failed the same `scripts/collie-ctl.test.sh` assertion as the
  `v1.24.0` sync ("bun not found"); the script exits 0 run directly. Web `bun run test` passed
  51,776 and timed out on 2 tests in `src/playground/app.test.tsx` (30 s and 19 s under the
  full run); the file passes 10/10 alone in 18 s. The fork does not touch the playground.

## fork/2026.10.1 (2026-10-29)

First immutable snapshot, on upstream `v1.24.0` (`4bab157e`).

### Fork modifications

- Name the fork snapshot in the build stamp: `vite.config.ts` writes the exact `fork/*` tag at
  `HEAD` as `fork`, or null. `collie version` reads `1.24.0-dev+<commit> (fork/2026.10.1)`; the
  wire spelling stays `1.24.0-dev+<commit>`.

- Replace the unconditional loopback-peer bind error with a diagnostic based on recent admitted
  inbound lead contact from a fresh runtime checkpoint and matching roster. Outgoing probes,
  stale or future records, contact from an earlier boot, and later secret refusals cannot clear it.
- Add synthetic regression cases and document operator-owned forwarding. No listener, network,
  authentication, enrollment, or wire-protocol behavior changes.
- Ignore local Pluram capture state so source provenance stays private and does not mark a
  clean frozen build as dirty. The capture data remains on disk for local inspection.

Checks for the snapshot commit: `bridge/version.test.ts` and `cli/doctor.test.ts` passed
192/192, root `bun test ./bridge ./cli` passed 10,886/10,886, both typechecks passed and lint
exited 0. Web vitest failed 2–4 timing-sensitive tests per full run (`router.test.tsx`,
`detail-offline.test.tsx` among them), each passing when run alone.

### Sync onto v1.24.0 (2026-10-26)

The maintained line was duplicated from base `v1.18.1` (`cfaf95a9`) onto exact upstream
`v1.24.0` (`4bab157e`). The old tip `07ce52c3` is kept as `archive/pre-sync/2026.10.1`.

| Old | New | Disposition |
| --- | --- | --- |
| `67672977` | `445d1eb1` | Identical (empty: the checkout's initialization). |
| `cb5f2976` | `8bbe31e8` | Ported. Upstream gave `bindCheck` a `leadOnLoopback` argument for a lead reached over a tunnel. The fork's inbound-contact check now runs after it, so `bindCheck` takes both. The `CHANGELOG.md` entry sits under `[Unreleased]`, above upstream's `[1.24.0]`. |
| `07ce52c3` | `e672084e` | Identical. |

Checks on the new tip:
- Narrow: `cli/doctor.test.ts` passed 188/188, both typechecks passed, and lint exited 0.
- Negative control: with the inbound-contact check disabled, exactly the two forwarded-peer
  tests fail.
- Broad: web `bun run test`, `bun run test:crew` (80/80) and `bun run build` passed. Root
  `bun run test` passed all 8,434 bun tests and failed one shell assertion in
  `scripts/collie-ctl.test.sh` ("the version gate failed" expected, "bun not found" printed).

That failure is a limitation of this harness, not a regression. Plain `v1.24.0` fails it
identically under `bun run test`, and the script passes run directly on either tree.
