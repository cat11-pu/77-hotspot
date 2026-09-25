import assert from "node:assert";
import { count } from "../window.js";
import { judge } from "../degrade.js";
import { render } from "../app.js";

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

const events = [{ key: "a", at: 1 }, { key: "a", at: 2 }];

check("count returns counts", () => {
  assert.strictEqual(typeof count(events, 5, 3).counts, "object");
});

check("count reports evicted", () => {
  assert.ok(Array.isArray(count(events, 5, 3).evicted));
});

check("judge returns hot list", () => {
  assert.ok(Array.isArray(judge({ a: 5 }, 3, 2).hot));
});

check("judge reports used", () => {
  assert.strictEqual(typeof judge({ a: 5 }, 3, 2).used, "number");
});

check("render exposes idempotent flag", () => {
  assert.strictEqual(typeof render({ events: events, window: 5, now: 3, threshold: 3, budget: 2 }).idempotent, "boolean");
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
