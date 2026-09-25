// window.js：窗口计数（基线：累计全量、不看窗口）
export function count(events, window, now) {
  const counts = {};
  for (const event of events) counts[event.key] = (counts[event.key] || 0) + 1;
  return { counts: counts, evicted: [] };
}
