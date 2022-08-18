import { describe, it, before } from "../../lib/index.js";
import assert from "assert";

describe("test", () => {
  before(() => assert(false));
  it("test", () => assert(true));
});
