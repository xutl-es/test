import assert from "assert";
import { describe, it, before, beforeEach } from "../lib/index.js";
import { exec } from "./utils/exec.mjs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("setup", () => {
  let prepped = false;
  let count = 0;
  before(() => {
    prepped = true;
  });
  beforeEach(() => {
    count += 1;
  });
  it("run", () => {
    assert(prepped);
    assert.equal(count, 1);
  });
  it("run", () => {
    assert(prepped);
    assert.equal(count, 2);
  });
  it("run", () => {
    assert(prepped);
    assert.equal(count, 3);
  });
  it("fail before", async () => assert(await exec(resolve(__dirname, "subtests/before.js"))));
  it("fail beforeEach", async () => assert(await exec(resolve(__dirname, "subtests/beforeeach.js"))));
});
