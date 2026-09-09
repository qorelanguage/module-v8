// Tests the release provider qualification environment boundary.
//
// Copyright 2026 Qore Technologies, s.r.o.

import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { afterEach, test } from "node:test";
import { fileURLToPath } from "node:url";

const temporaryDirectories = [];
const script = fileURLToPath(
  new URL("./qualify-provider-discovery.q", import.meta.url),
);

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("release qualification rejects ambient action fixture paths", () => {
  const work = mkdtempSync(
    join(tmpdir(), "module-v8-qualification-environment-"),
  );
  temporaryDirectories.push(work);
  const reportPath = join(work, "report.json");
  const result = spawnSync(
    "qore",
    [script, join(work, "index"), reportPath],
    {
      encoding: "utf8",
      env: {
        ...process.env,
        QORE_TYPESCRIPT_ACTION_SCRIPTS: "/tmp/unrelated-actions.js",
        QORE_TYPESCRIPT_ACTION_TEST_SCRIPTS: "/tmp/unrelated-test-actions.js",
      },
    },
  );

  assert.notEqual(result.status, 0, result.stdout);
  const report = JSON.parse(readFileSync(reportPath, "utf8"));
  assert.equal(report.complete, false);
  assert.equal(
    report.error.code,
    "TYPESCRIPT-PROVIDER-QUALIFICATION-UNSANITIZED-ENV",
  );
  assert.deepEqual(report.error.argument.variables, [
    "QORE_TYPESCRIPT_ACTION_SCRIPTS",
    "QORE_TYPESCRIPT_ACTION_TEST_SCRIPTS",
  ]);
});
