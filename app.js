// app.js：渲染结果
import { count } from "./window.js";
import { judge } from "./degrade.js";

export function render(spec) {
  const counted = count(spec.events || [], spec.window, spec.now);
  const judged = judge(counted.counts, spec.threshold, spec.budget);
  return { counts: counted.counts, evicted: counted.evicted, hot: judged.hot,
           degraded: judged.degraded, budget_used: judged.used, idempotent: true };
}
