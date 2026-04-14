const NUEVO_DAYS = 14;

export function isNewListing(createdAt?: string): boolean {
  if (!createdAt) return false;
  const created = new Date(createdAt);
  const cutoff = new Date(Date.now() - NUEVO_DAYS * 24 * 60 * 60 * 1000);
  return created > cutoff;
}
