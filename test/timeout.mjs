import { exec } from "./utils/exec.mjs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import assert from "assert";
import { describe, it, timeout } from "../lib/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("Timeout", () => {
  timeout("should fail for 5000ms", 10000, async () => assert.equal(await exec(resolve(__dirname, "subtests/timeout-fail.mjs")), 1));
  timeout("should pass for 1000ms", 10000, async () => assert.equal(await exec(resolve(__dirname, "subtests/timeout-pass.mjs")), 0));
  it.timeout("should fail for 5000ms", 10000, async () => assert.equal(await exec(resolve(__dirname, "subtests/timeout-fail.mjs")), 1));
  it.timeout("should pass for 1000ms", 10000, async () => assert.equal(await exec(resolve(__dirname, "subtests/timeout-pass.mjs")), 0));
});
