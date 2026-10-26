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
- **Consumer edges:** Fedora runs the official 1.23.4 payload (checked 2026-10-26). Preparing
  this fork does not repin or deploy any installation.
- **Runtime extensions:** none added by the fork.
- **Prepared-build identity:** retain upstream manifest version plus the actual fork commit in
  Collie's existing build stamp (`1.18.1-dev+<commit>` on an untagged fork). Freeze the patch and
  build from a clean jj child so Git's `HEAD` names the patch rather than its parent. No immutable
  fork snapshot is released yet.
  Before a release, add an immutable `fork/YYYY.M.N` ledger entry and make the displayed build
  identity include its upstream point and snapshot, as required by the shared fork convention.

## Unreleased

### Fork modifications

- Replace the unconditional loopback-peer bind error with a diagnostic based on recent admitted
  inbound lead contact from a fresh runtime checkpoint and matching roster. Outgoing probes,
  stale or future records, contact from an earlier boot, and later secret refusals cannot clear it.
- Add synthetic regression cases and document operator-owned forwarding. No listener, network,
  authentication, enrollment, or wire-protocol behavior changes.
- Ignore local Pluram capture state so source provenance stays private and does not mark a
  clean frozen build as dirty. The capture data remains on disk for local inspection.

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
