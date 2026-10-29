# Personal Collie fork

This independent maintenance repository carries local fixes over
[AltanS/collie](https://github.com/AltanS/collie). The original project is read-only: no pushes,
pull requests, issues, releases, or workflow actions there. Personal repositories are independent
repositories, outside the original project's fork network.

## Sync contract

- **Maintained bookmark:** `custom`.
- **Upstream ref:** `main@upstream`; local `main` is a patch-free upstream mirror.
- **Maintained base:** upstream `v1.24.0`, commit `4bab157edb527266837dd9dd20b67e1ac82efcae`,
  since the 2026-10-26 sync. The initial base was `v1.18.1`, commit
  `cfaf95a93df3c9404a03f5f840bf222f0cd6c2ee`.
- **Personal remotes:** Forgejo `origin` and GitHub `github`, both owned by `silvanshine`.
- **Upstream remote:** anonymous HTTPS, with `/dev/null` as its only push URL.
- **Snapshot policy:** `snapshot.auto-track = "none()"`; track intentional new files explicitly.
- **Narrow validation:** `bun test cli/doctor.test.ts`, both root and web typechecks, full lint.
- **Broad validation:** root `bun run test`, web `bun run test`, `bun run test:crew`, and full
  `bun run build`. Record environment-related limitations separately from verified checks.
- **Consumer edges:** Fedora's bridge runs this fork from the jj workspace
  `~/projects/forks/collie-deploy` since 2026-10-27, built with `scripts/collie-ctl.sh build`.
  Never run `collie update` there: on a source checkout it moves to the newest upstream tag with
  Git, dropping the fork commits. Move the workspace onto `custom` and build again instead.
- **Runtime extensions:** none added by the fork.
- **Build identity:** the upstream manifest version plus the fork commit, in Collie's existing
  build stamp (`1.24.0-dev+<commit>`). Build from a clean jj child so Git's `HEAD` names the
  commit rather than its parent. A build at a `fork/YYYY.M.N` tag also records the tag in the
  stamp's `fork` field, which `collie version` prints in parentheses and the PWA footer shows after
  the commit. The crew wire version, the stamp's `id` and the release/dev channel do not change.

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
