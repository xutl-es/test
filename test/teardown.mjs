import assert from "assert";
import { describe, it, after, afterEach } from "../lib/index.js";
import { exec } from "./utils/exec.mjs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("teardown", () => {
  let complete = false;
  let count = 0;
  describe("teardown", () => {
    after(() => {
      complete = true;
    });
    afterEach(() => {
      count += 1;
    });
    it("run", () => assert.equal(count, 0));
    it("run", () => assert.equal(count, 1));
    it("run", () => assert.equal(count, 2));
    it("run", () => assert.equal(count, 3));
  });
  it("done", () => assert(complete));
  it("count", () => assert.equal(count, 4));

  it("fail after", async () => assert(await exec(resolve(__dirname, "subtests/after.js"))));
  it("fail aftereach", async () => assert(await exec(resolve(__dirname, "subtests/aftereach.js"))));
});
