// degrade.js：热点与降级（基线：不判热点、不降级）
export function judge(counts, threshold, budget) {
  return { hot: [], degraded: [], used: 0 };
}
