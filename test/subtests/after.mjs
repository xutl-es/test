import { describe, it, after } from "../../lib/index.js";
import assert from "assert";

describe("test", () => {
  after(() => assert(false));
  it("test", () => assert(true));
});
