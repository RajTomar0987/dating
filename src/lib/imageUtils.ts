export const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

/**
 * Returns a valid, persistent image URL.
 * Gracefully ignores `blob:` URLs and unresolvable strings, falling back to a default avatar.
 */
export function getValidImageUrl(
  url?: string | null,
  fallbackUrl: string = DEFAULT_AVATAR
): string {
  if (!url || typeof url !== 'string') return fallbackUrl;
  const trimmed = url.trim();
  if (trimmed.startsWith('blob:')) return fallbackUrl;
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image/')) {
    return fallbackUrl;
  }
  return trimmed;
}

/**
 * Filters an array of photo URLs, discarding any `blob:` URLs.
 * Returns an array with valid URLs or a fallback array containing the default avatar.
 */
export function sanitizePhotoArray(
  photos?: any[],
  fallbackUrl: string = DEFAULT_AVATAR
): string[] {
  if (!Array.isArray(photos)) return [fallbackUrl];
  const valid = photos
    .filter((p): p is string => typeof p === 'string' && p.trim().length > 0 && !p.trim().startsWith('blob:'))
    .map((p) => p.trim());

  return valid.length > 0 ? valid : [fallbackUrl];
}
