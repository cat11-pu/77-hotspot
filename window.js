// window.js：滑窗计数（单趟线性扫描；窗口内计数，窗口外的事件只入淘汰清单，不重复计数）
export function count(events, window, now) {
  if (!(window > 0)) {
    const error = new Error("E_BAD_WINDOW");
    error.code = "E_BAD_WINDOW";
    throw error;
  }
  const counts = Object.create(null);
  const expired = Object.create(null);
  const evicted = [];
  const cutoff = now - window;
  for (const event of events) {
    const key = event.key;
    if (event.at > cutoff) {
      counts[key] = (counts[key] || 0) + 1;
    } else if (!(key in expired)) {
      expired[key] = true;
      evicted.push(key);
    }
  }
  return { counts: counts, evicted: evicted };
}
