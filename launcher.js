// The launcher's choices (decision 0016), as plain functions so tests/launcher.test.ts can check them in Node.
// The page (index.html) tries the portal hosts in order and moves the whole page to the first one that answers
// as our hub: the portal stays same-origin, so login (HttpOnly cookie), saves and games work as they do now.

/** The hub's ping as nginx serves it on every portal host (kit/hub/server.ts GET /api/ping). */
export const PING_PATH = "/games/hub/server/api/ping";
const REMEMBER = "agame-launcher-host";

/** The host that worked last time first (only if it is still configured), then the configured order. */
export function candidateOrder(hosts, remembered) {
  return remembered && hosts.includes(remembered) ? [remembered, ...hosts.filter((h) => h !== remembered)] : [...hosts];
}

/** True only when the host answers as our hub within timeoutMs: a proxy's own "blocked" page, an error or a
 *  host that never answers does not count. */
export async function probeHost(host, fetchImpl, timeoutMs) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const r = await fetchImpl(host + PING_PATH, { signal: ctl.signal, cache: "no-store", credentials: "omit" });
    if (!r.ok) return false;
    const body = await r.json().catch(() => null);
    return body?.portal === "agame-hub";
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/** The first host whose probe passes, tried one after another; null when none does. */
export async function findPortal(hosts, { probe, remembered = null }) {
  for (const h of candidateOrder(hosts, remembered)) if (await probe(h)) return h;
  return null;
}

/** Where to go on the portal: a plain path under /games/ (no other site, no "..", no "//"), else the lobby. */
export function safeTarget(to) {
  if (typeof to !== "string" || !/^\/games\/[A-Za-z0-9_\-/]*$/.test(to) || to.includes("//")) return "/games/hub/";
  return to;
}

/** Remembered host from the browser; storage can be blocked, which only costs the "try this one first". */
export function recall() {
  try { return localStorage.getItem(REMEMBER); } catch { return null; }
}
export function remember(host) {
  try { localStorage.setItem(REMEMBER, host); } catch { /* blocked storage: next visit just tries the list in order */ }
}
