# Personal Collie fork

This independent maintenance repository carries local fixes over
[AltanS/collie](https://github.com/AltanS/collie). The original project is read-only: no pushes,
pull requests, issues, releases, or workflow actions there. Personal repositories are independent
repositories, outside the original project's fork network.

## Sync contract

- **Maintained bookmark:** `custom`.
- **Upstream ref:** `main@upstream`; local `main` is a patch-free upstream mirror.
- **Initial maintained base:** upstream `v1.18.1`, commit
  `cfaf95a93df3c9404a03f5f840bf222f0cd6c2ee`, matching the installed Fedora and Zen releases.
- **Personal remotes:** Forgejo `origin` and GitHub `github`, both owned by `silvanshine`.
- **Upstream remote:** anonymous HTTPS, with `/dev/null` as its only push URL.
- **Snapshot policy:** `snapshot.auto-track = "none()"`; track intentional new files explicitly.
- **Narrow validation:** `bun test cli/doctor.test.ts`, both root and web typechecks, full lint.
- **Broad validation:** root `bun run test`, web `bun run test`, `bun run test:crew`, and full
  `bun run build`. Record environment-related limitations separately from verified checks.
- **Consumer edges:** Fedora and Zen currently run official 1.18.1 payloads. Preparing this fork
  does not repin or deploy either installation.
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
