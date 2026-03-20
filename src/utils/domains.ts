export function normalizeDomain(hostname: string): string {
  if (!hostname) return "";
  return hostname.replace(/^www\./i, "").toLowerCase();
}

export function normalizeDomainList(list: unknown): string[] {
  if (!Array.isArray(list)) return [];
  return list
    .map((domain) => (typeof domain === "string" ? normalizeDomain(domain) : ""))
    .filter(Boolean);
}

export function getDomainFromUrl(url: string | undefined): string {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (!parsed.hostname || !parsed.protocol.startsWith("http")) return "";
    return normalizeDomain(parsed.hostname);
  } catch {
    return "";
  }
}
