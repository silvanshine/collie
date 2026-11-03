import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  FORK_RELEASE_CHECK_OFF,
  forkReleaseFetchers,
  UpdateMonitor,
  type UpdateStore,
} from "./update.ts";

// The personal fork's only change to the update path: its bridge asks for no releases, so nothing on
// the phone ever offers an upstream update. See FORK_CHANGELOG.md.

function quietStore(): UpdateStore & { saved: string[] } {
  const saved: string[] = [];
  return {
    saved,
    lastNotified: () => null,
    lastPushedAt: () => null,
    setLastNotified: async (v) => {
      saved.push(v);
    },
    dismissedVersion: () => null,
    dismissedCrewVersion: () => null,
    dismissedCrewAt: () => null,
    setDismissed: async () => {},
  };
}

function forkMonitor() {
  const notified: string[] = [];
  const store = quietStore();
  const reads = forkReleaseFetchers();
  const monitor = new UpdateMonitor({
    repo: "AltanS/collie",
    current: "0.11.0",
    installKind: "detached-checkout",
    instance: null,
    packageCommand: null,
    bootVersion: "0.11.0",
    liveVersion: () => "0.11.0",
    exeReplaced: () => false,
    startupStamp: "STAMP@boot",
    fetchTags: reads.fetchTags,
    crewProtocol: 2,
    crewMode: () => "lead",
    fetchReleaseReading: reads.fetchReleaseReading,
    bridgeStamp: () => "STAMP@boot",
    store,
    runState: () => null,
    now: () => new Date(2026, 0, 15, 10, 0, 0).getTime(),
    // The pref is ON: the fork's silence must not depend on the operator having turned it off.
    updatesEnabled: () => true,
    notify: (versions) => {
      notified.push(...versions);
    },
  });
  return { monitor, notified, store };
}

describe("a fork build never checks upstream releases", () => {
  it("the check fails with the fork's reason and reads nothing", async () => {
    const reads = forkReleaseFetchers();
    await expect(reads.fetchTags()).rejects.toThrow(FORK_RELEASE_CHECK_OFF);
    expect(await reads.fetchReleaseReading("9.9.9")).toBeNull();
    expect(reads.warning).toBe(FORK_RELEASE_CHECK_OFF);
  });

  it("no push, no offer and no recorded check, with the updates pref on", async () => {
    const { monitor, notified, store } = forkMonitor();
    await monitor.checkRelease();
    expect(notified).toEqual([]);
    expect(store.saved).toEqual([]);
    expect(monitor.status()).toMatchObject({
      latest: null,
      releaseAvailable: false,
      majorAvailable: null,
      newerVersions: [],
      // Null, so a manual "check for updates" reports a failed check, never "Up to date".
      checkedAt: null,
    });
  });

  it("the bridge is wired to the fork's reads, not upstream's", () => {
    const index = readFileSync(join(import.meta.dir, "index.ts"), "utf8");
    expect(index).toContain("const releaseReads = forkReleaseFetchers();");
    expect(index).not.toMatch(/[^k]releaseFetchers\(/);
  });
});
