// degrade.js：热点判定与按预算降级，单次线性扫描。
export function judge(counts, threshold, budget) {
  const hot = [];
  const degraded = [];
  let used = 0;
  for (const key of Object.keys(counts)) {
    if (counts[key] >= threshold) {
      hot.push(key);
      if (used < budget) {
        degraded.push(key);
        used += 1;
      }
    }
  }
  return { hot: hot, degraded: degraded, used: used };
}
