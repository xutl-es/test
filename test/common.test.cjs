const assert = require("node:assert");
const { describe, it } = require("../");

describe("common test 1", () => {
  test(1, true);
  test(2, true);
  test(3, true);
});

describe("common test 2", () => {
  test(1, true);
  test(2, true);
  test(3, true);
  test(4, true);
});

function test(idx, pass) {
  it(`${pass ? "pass" : "fail"} ${idx}`, () => assert(pass));
}
