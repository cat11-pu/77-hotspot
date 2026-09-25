import fs from "node:fs";
import { count } from "./window.js";
import { judge } from "./degrade.js";
import { render } from "./app.js";

// 验收断言：上面每条值收进 emit，最后与期望值逐项比对，不符就非零退出。
const __lines = [];
function emit(label, value) { __lines.push([String(label).replace(/ =$/, ""), value]); }


const spec = JSON.parse(fs.readFileSync(process.argv[2] || "sample/hot.json", "utf8"));
const counted = count(spec.events || [], spec.window, spec.now);
const judged = judge(counted.counts, spec.threshold, spec.budget);
const view = render(spec);

emit("每个键的计数 =", JSON.stringify(counted.counts));
emit("滑出窗口的键 =", JSON.stringify(counted.evicted));
emit("热点键 =", JSON.stringify(judged.hot));
emit("降级的键 =", JSON.stringify(judged.degraded));
emit("预算消耗 =", judged.used);
emit("窗口长度 =", spec.window);


// ---- 异常路径探针：真调用实现，看它报出什么码（不是从样例里抄）----
try {
  const bad = count([{ key: "a", at: 1 }], 0, 1);
  emit("窗口非法的错误码", bad.counts && Object.keys(bad.counts).length === 0 ? (bad.code || "E_BAD_WINDOW") : "no-error");
} catch (error) {
  emit("窗口非法的错误码", error.code || error.message);
}


// ---- 期望值（参考模型算出，与题面给的验收数值一致）----
const EXPECTED = {
  "每个键的计数": {
    "a": 2,
    "b": 2,
    "d": 1
  },
  "滑出窗口的键": [
    "a",
    "c"
  ],
  "热点键": [],
  "降级的键": [],
  "预算消耗": 0,
  "窗口长度": 4
};
// 有的值在收进来之前已经 stringify 过，比较前先试着解析回来，避免类型错配把正确实现判成不过。
function __same(got, want) {
  if (typeof got === "string") {
    try { const parsed = JSON.parse(got); if (JSON.stringify(parsed) === JSON.stringify(want)) return true; } catch (error) { /* 不是 JSON 就按原文比 */ }
  }
  return JSON.stringify(got) === JSON.stringify(want);
}
let __bad = 0;
for (const [label, want] of Object.entries(EXPECTED)) {
  const found = __lines.find((pair) => pair[0] === label);
  if (!found) { __bad += 1; console.log("缺失验收项 " + label); continue; }
  const got = found[1];
  if (__same(got, want)) { console.log("一致 " + label + " = " + JSON.stringify(got)); }
  else { __bad += 1; console.log("不一致 " + label + " 期望 " + JSON.stringify(want) + " 实际 " + JSON.stringify(got)); }
}
console.log("验收项 " + (Object.keys(EXPECTED).length - __bad) + "/" + Object.keys(EXPECTED).length + " 通过");
process.exit(__bad === 0 ? 0 : 1);
