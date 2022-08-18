import { describe, timeout } from "../../lib/index.js";
import { sleep } from "../utils/sleep.mjs";

describe("timeout-pass", () => {
  timeout("timeout 1000", 1000, () => sleep(900));
});
