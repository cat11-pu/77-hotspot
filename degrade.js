// degrade.js：热点判定与预算内降级（达阈值即热点；预算外只标记不降级，仍留在热点清单）
export function judge(counts, threshold, budget) {
  const hot = [];
  for (const key of Object.keys(counts)) {
    if (counts[key] >= threshold) hot.push(key);
  }
  const degraded = budget > 0 ? hot.slice(0, budget) : [];
  return { hot: hot, degraded: degraded, used: degraded.length };
}
