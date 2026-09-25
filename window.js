// window.js：滑窗计数，只统计落在 (now - window, now] 内的事件，单次线性扫描。
export function count(events, window, now) {
  if (!(window > 0)) {
    const error = new Error("window must be positive");
    error.code = "E_BAD_WINDOW";
    throw error;
  }
  const cutoff = now - window;
  const counts = {};
  const evicted = [];
  const seenEvicted = new Set();
  for (const event of events) {
    if (event.at > cutoff) {
      counts[event.key] = (counts[event.key] || 0) + 1;
    } else if (!seenEvicted.has(event.key)) {
      seenEvicted.add(event.key);
      evicted.push(event.key);
    }
  }
  return { counts: counts, evicted: evicted };
}
